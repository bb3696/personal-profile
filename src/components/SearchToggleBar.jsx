import React, { useCallback } from 'react';
import { Download, RotateCcw, Search } from 'lucide-react';
import '../css/SearchToggleBar.css';

function SearchToggleBar({
  searchText,
  setSearchText,
  showVisitedOnly,
  setShowVisitedOnly,
  placeholder,
  presetValue,
  onPresetChange,
  onClear,
  onPrint,
}) {
  const searchId = React.useId();
  const toggleId = React.useId();
  const presetToggleId = React.useId();

  const handleSearchChange = useCallback((event) => {
    setSearchText(event.target.value);
  }, [setSearchText]);

  const handleVisitedOnlyChange = useCallback((event) => {
    setShowVisitedOnly(event.target.checked);
  }, [setShowVisitedOnly]);

  const handlePresetToggleChange = useCallback((event) => {
    onPresetChange(event.target.checked ? 'tony' : 'custom');
  }, [onPresetChange]);

  return (
    <section className="search-toggle-container" aria-label="Explorer controls">
      <div className="search-field">
        <Search className="search-field-icon" aria-hidden="true" size={18} strokeWidth={2} />
        <label className="sr-only" htmlFor={searchId}>
          {placeholder || 'Search'}
        </label>
        <input
          id={searchId}
          type="search"
          placeholder={placeholder}
          value={searchText}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="toggle-wrapper">
        <label className="toggle-switch" htmlFor={toggleId}>
          <input
            id={toggleId}
            type="checkbox"
            checked={showVisitedOnly}
            onChange={handleVisitedOnlyChange}
            aria-label="Show visited only"
          />
          <span className="slider" />
        </label>
        <span className="toggle-label">Visited</span>
      </div>

      {onPresetChange != null && (
        <label className="preset-toggle" htmlFor={presetToggleId}>
          <input
            id={presetToggleId}
            type="checkbox"
            checked={presetValue === 'tony'}
            onChange={handlePresetToggleChange}
            aria-label="Use Tony preset"
          />
          <span>Tony</span>
        </label>
      )}

      {(onClear != null || onPrint != null) && (
        <div className="action-wrapper">
          {onClear != null && (
            <button type="button" className="clear-btn" onClick={onClear} title="Clear all visited">
              <RotateCcw aria-hidden="true" size={16} strokeWidth={2} />
              <span>Clear</span>
            </button>
          )}

          {onPrint != null && (
            <button type="button" className="print-btn" onClick={() => onPrint()} title="Download PNG">
              <Download aria-hidden="true" size={16} strokeWidth={2} />
              <span>Export</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default React.memo(SearchToggleBar);
