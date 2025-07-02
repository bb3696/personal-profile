import React from 'react';
import '../css/SearchBox.css'; // 可选

function SearchToggleBar({ searchText, setSearchText, showVisitedOnly, setShowVisitedOnly, placeholder }) {
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
            onChange={() => setShowVisitedOnly(!showVisitedOnly)}
          />
          <span className="slider" />
        </label>
        <span className="toggle-label">Visited</span>
      </div>
    </div>
  );
}

export default SearchToggleBar;
