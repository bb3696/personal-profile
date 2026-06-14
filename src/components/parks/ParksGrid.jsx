import React from 'react';
import ParkCard from '../ParkCard';
import EmptyState from '../common/EmptyState';
import { getParkThumbnailPath } from '../../utils/parkImages';

function ParksGrid({
  onToggleVisited,
  parks,
  visitedParks,
}) {
  if (parks.length === 0) {
    return (
      <EmptyState
        title="No matching parks found"
        description="Try a different search or turn off the visited-only filter."
      />
    );
  }

  return (
    <div className="parks-grid reveal-up">
      {parks.map((parkName) => (
        <ParkCard
          key={parkName}
          image={getParkThumbnailPath(parkName)}
          onToggleVisited={onToggleVisited}
          park={parkName}
          visited={visitedParks.has(parkName)}
        />
      ))}
    </div>
  );
}

export default React.memo(ParksGrid);
