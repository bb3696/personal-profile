import React, { useEffect, useState } from 'react';
import '../css/ParkCard.css';

function ParkCard({ park, image, onToggleVisited }) {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(park + ' National Park')}`;

  const [visited, setVisited] = useState(() => localStorage.getItem(`visited_${park}`) === 'true');

  useEffect(() => {
    setVisited(localStorage.getItem(`visited_${park}`) === 'true');
  }, [park]);

  const toggleVisited = () => {
    const newVisited = !visited;
    setVisited(newVisited);
    localStorage.setItem(`visited_${park}`, newVisited.toString());
    onToggleVisited?.();
  };

  return (
    <div
      className={`park-card ${visited ? 'visited' : ''}`}
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
