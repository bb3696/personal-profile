import React, { useCallback, useMemo } from 'react';
import '../css/ParkCard.css';

function ParkCard({
  image,
  onToggleVisited,
  park,
  visited,
}) {
  const googleSearchUrl = useMemo(
    () => `https://www.google.com/search?q=${encodeURIComponent(`${park} National Park`)}`,
    [park],
  );

  const toggleVisited = useCallback(() => {
    onToggleVisited(park);
  }, [onToggleVisited, park]);

  return (
    <article className={`park-card ${visited ? 'visited' : ''}`}>
      <button
        type="button"
        onClick={toggleVisited}
        className="park-image-button"
        aria-pressed={visited}
        aria-label={`${visited ? 'Unmark' : 'Mark'} ${park} as visited`}
        title={visited ? 'Visited' : 'Mark as visited'}
      >
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="park-image"
        />
        <span className="park-status-badge">
          {visited ? 'Visited' : 'To visit'}
        </span>
      </button>
      <a
        className="park-name"
        href={googleSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {park}
      </a>
    </article>
  );
}

export default React.memo(ParkCard);
