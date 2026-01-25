import React from 'react';
import '../css/SearchToggleBar.css';

function SearchToggleBar({ searchText, setSearchText, showVisitedOnly, setShowVisitedOnly, placeholder, onClear, onPrint }) {
  return (
    <div className="search-toggle-container">
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      <div className="toggle-wrapper">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showVisitedOnly}
            onChange={(e) => setShowVisitedOnly(e.target.checked)}
          />
          <span className="slider" />
        </label>
        <span className="toggle-label">Visited</span>
      </div>

      {onClear != null && (
        <button type="button" className="clear-btn" onClick={onClear} title="Clear all visited">
          Clear
        </button>
      )}

      {onPrint != null && (
        <button type="button" className="print-btn" onClick={onPrint} title="Print / Export PDF">
          Print
        </button>
      )}
    </div>
  );
}

export default SearchToggleBar;
