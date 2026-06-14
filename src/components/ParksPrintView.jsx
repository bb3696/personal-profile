import React, { useMemo } from 'react';
import { PARK_NAMES } from '../data/parkList';
import { getParkThumbnailPath } from '../utils/parkImages';
import { isParkVisited } from '../hooks/useVisitedParks';
import '../css/PrintView.css';

function ParksPrintView() {
  const parkPrintItems = useMemo(() => PARK_NAMES.map((name) => ({
    image: getParkThumbnailPath(name),
    name,
    visited: isParkVisited(name),
  })), []);
  const visitedCount = parkPrintItems.filter((park) => park.visited).length;
  const totalParks = PARK_NAMES.length;
  const date = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }), []);

  return (
    <div className="print-view parks-print">
      <div className="print-header">
        <h1 className="print-title">National Parks I've Explored</h1>
        <p className="print-subtitle">
          {visitedCount} out of {totalParks} National Parks
        </p>
        <p className="print-date">Generated on {date}</p>
      </div>

      <div className="print-content">
        <div className="print-parks-grid">
          {parkPrintItems.map(({ image, name, visited }) => (
            <div
              key={name}
              className={`print-park-item ${visited ? 'print-park-item--visited' : ''}`}
            >
              <img
                src={image}
                alt={name}
                className="print-park-image"
              />
              <p className="print-park-name">{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="print-footer">
        <p className="print-signature">Travel Tracker</p>
      </div>
    </div>
  );
}

export default ParksPrintView;
