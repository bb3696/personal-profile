import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ParkCard from '../components/ParkCard';
import { PARK_NAMES } from '../data/parkList';
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

    // 追踪动画效果
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
    // 当 filter 条件变化时触发动画
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
        setIsTransitioning(false);
    }, 400); // 动画时长

    return () => clearTimeout(timeout);
    }, [searchText, showVisitedOnly]);


    // 计算总公园数和已访问公园数
    const totalParks = PARK_NAMES.length;
    const [visitedCount, setVisitedCount] = useState(() =>
    PARK_NAMES.filter((name) => localStorage.getItem(`visited_${name}`) === 'true').length
    );
    
    const updateVisitedCount = () => {
        const count = PARK_NAMES.filter((name) => localStorage.getItem(`visited_${name}`) === 'true').length;
        setVisitedCount(count);
    };

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
        placeholder={"Search parks..."} // 👈 这里改提示文字
        />

      {/* 🎯 过滤后的卡片展示 */}
      <div className={`grid fade-in ${isTransitioning ? 'grid-transition' : ''}`}>
        {filteredParks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>No matching parks found.</p>
        ) : (
          PARK_NAMES.map((name) => {
            const visited = localStorage.getItem(`visited_${name}`) === 'true';
            const matchesSearch = name.toLowerCase().includes(searchText.toLowerCase());
            const shouldShow = matchesSearch && (visited || !showVisitedOnly);

            const filename = normalizeParkName(name);
            const imagePath = `${import.meta.env.BASE_URL}thumbnails/${filename}`;

            return (
              <ParkCard
                key={name}
                park={name}
                image={imagePath}
                showVisitedOnly={showVisitedOnly}
                className={showVisitedOnly ? 'visited-transition' : ''}
                onToggleVisited={updateVisitedCount}
                visible={shouldShow} // ✅ 传入 visible 控制展示
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Parks;
