import React from 'react';
import { STATE_ABBR } from '../data/stateList';
import '../css/PrintView.css';

function StatesPrintView() {
  const stored = localStorage.getItem("visitedStates");
  const selected = stored ? JSON.parse(stored) : [];
  const visitedCount = selected.length;
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // 所有州的列表（按字母顺序）
  const allStates = Object.entries(STATE_ABBR)
    .map(([fullName, abbr]) => ({ fullName, abbr }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  return (
    <div className="print-view states-print">
      <div className="print-header">
        <h1 className="print-title">US States I've Visited</h1>
        <p className="print-subtitle">
          {visitedCount} out of 50 States
        </p>
        <p className="print-date">Generated on {date}</p>
      </div>

      <div className="print-content">
        {visitedCount === 0 ? (
          <p className="print-empty">No states visited yet.</p>
        ) : (
          <div className="print-states-list">
            <p className="print-states-count">
              I have visited <strong>{visitedCount}</strong> {visitedCount === 1 ? 'state' : 'states'} across the United States.
            </p>
            <div className="print-states-grid">
              {allStates.map(({ fullName, abbr }) => (
                <span key={abbr} className="print-state-item">
                  {abbr} - {fullName}
                </span>
              ))}
            </div>
            <p className="print-note">
              * {visitedCount} states marked as visited in your profile.
            </p>
          </div>
        )}
      </div>

      <div className="print-footer">
        <p className="print-signature">Tony Yang</p>
      </div>
    </div>
  );
}

export default StatesPrintView;
