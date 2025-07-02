import React, { useEffect, useState } from 'react';
import '../css/ParkCard.css';

function ParkCard({ park, image, className= '', showVisitedOnly = false, onToggleVisited, visible }) {
  const [visited, setVisited] = useState(false);

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(park + ' National Park')}`;

  useEffect(() => {
    const saved = localStorage.getItem(`visited_${park}`);
    setVisited(saved === 'true');
  }, [park]);

  const toggleVisited = () => {
    const newVisited = !visited;
    setVisited(newVisited);
    localStorage.setItem(`visited_${park}`, newVisited.toString());
    if (onToggleVisited) onToggleVisited();
  };

    // 延迟隐藏逻辑
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => setHide(true), 200);
      return () => clearTimeout(timeout);
    } else {
      setHide(false);
    }
  }, [visible]);


  return (
      <div
        className={`park-card ${visited ? 'visited' : ''} ${className} ${!visible && hide ? 'hidden' : ''}`}
        data-visible={visible}
        title={visited ? 'Visited' : 'Click image to mark as visited'}
      >
      <img
        src={image}
        alt={park}
        onClick={toggleVisited}
        className="park-image"
      />
      <a
        className="park-name"
        href={googleSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {park}
      </a>
    </div>
  );
}

export default ParkCard;
