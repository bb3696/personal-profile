import React from 'react';
import { PARK_NAMES } from '../data/parkList';
import '../css/PrintView.css';

function normalizeParkName(name) {
  return name
    .replace(/’/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_') + '_National_Park.jpg';
}

function ParksPrintView() {
  const visitedCount = PARK_NAMES.filter((name) => 
    localStorage.getItem(`visited_${name}`) === 'true'
  ).length;
  const totalParks = PARK_NAMES.length;
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
          {PARK_NAMES.map((name) => {
            const visited = localStorage.getItem(`visited_${name}`) === 'true';
            const filename = normalizeParkName(name);
            const imagePath = `${import.meta.env.BASE_URL}thumbnails/${filename}`;
            return (
              <div 
                key={name} 
                className={`print-park-item ${visited ? 'print-park-item--visited' : ''}`}
              >
                <img 
                  src={imagePath} 
                  alt={name} 
                  className="print-park-image"
                />
                <p className="print-park-name">{name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="print-footer">
        <p className="print-signature">Tony Yang</p>
      </div>
    </div>
  );
}

export default ParksPrintView;
