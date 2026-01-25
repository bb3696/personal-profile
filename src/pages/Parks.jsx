import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ParkCard from '../components/ParkCard';
import { PARK_NAMES, DEFAULT_VISITED } from '../data/parkList';
import SearchToggleBar from '../components/SearchToggleBar';
import '../css/Parks.css';

function normalizeParkName(name) {
  return name
    .replace(/’/g, '') // 替换撇号
    .replace(/[^\w\s]/g, '') // 移除其他特殊字符
    .replace(/\s+/g, '_') + '_National_Park.jpg'; // 空格转下划线 + 后缀
}


function Parks() {
  const [searchText, setSearchText] = useState('');
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);


  // 动态背景跟随鼠标
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const angle = Math.round(x * 360);
      document.body.style.background = `linear-gradient(${angle}deg, #0d1a26, #1f3b4d)`;
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  // 搜索 + 是否访问过滤逻辑
  const filteredParks = PARK_NAMES.filter((name) => {
    const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase());

    if (!matchesSearch) return false;

    if (showVisitedOnly) {
      const visited = localStorage.getItem(`visited_${name}`) === 'true';
      return visited;
    }

    return true;
  });

  // 计算总公园数和已访问公园数
  const totalParks = PARK_NAMES.length;
  const [visitedCount, setVisitedCount] = useState(() =>
    PARK_NAMES.filter((name) => localStorage.getItem(`visited_${name}`) === 'true').length
  );

  const updateVisitedCount = () => {
    const count = PARK_NAMES.filter((name) => localStorage.getItem(`visited_${name}`) === 'true').length;
    setVisitedCount(count);
  };

  const [refreshKey, setRefreshKey] = useState(0);

  const clearVisited = () => {
    PARK_NAMES.forEach((name) => localStorage.removeItem(`visited_${name}`));
    setShowVisitedOnly(false);
    setRefreshKey((k) => k + 1);
    updateVisitedCount();
  };

  // 初始化：将 `DEFAULT_VISITED` 中列出的公园标记为已访问（如果尚未标记）
  useEffect(() => {
    if (Array.isArray(DEFAULT_VISITED) && DEFAULT_VISITED.length > 0) {
      DEFAULT_VISITED.forEach((name) => {
        if (PARK_NAMES.includes(name) && localStorage.getItem(`visited_${name}`) !== 'true') {
          localStorage.setItem(`visited_${name}`, 'true');
        }
      });
      updateVisitedCount();
    }
  }, []);

  return (
    <div className="parks-page">
      <h1>
        National Parks I've Explored
        <span className="visited-count">
          ({visitedCount} / {totalParks})
        </span>
      </h1>

      <div className="home">
        <Link className="park-link" to="/">Home</Link>
      </div>

      <SearchToggleBar
        searchText={searchText}
        setSearchText={setSearchText}
        showVisitedOnly={showVisitedOnly}
        setShowVisitedOnly={setShowVisitedOnly}
        placeholder="Search parks..."
        onClear={clearVisited}
      />

      <div className="grid fade-in">
        {filteredParks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>No matching parks found.</p>
        ) : (
          filteredParks.map((name) => {
            const filename = normalizeParkName(name);
            const imagePath = `${import.meta.env.BASE_URL}thumbnails/${filename}`;
            return (
              <ParkCard
                key={`${name}-${refreshKey}`}
                park={name}
                image={imagePath}
                onToggleVisited={updateVisitedCount}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Parks;
