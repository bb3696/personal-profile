import React, { useMemo } from 'react';
import { geoCentroid } from 'd3-geo';
import { STATE_ABBR } from '../data/stateList';
import { createUsMapPath, isStateSelected, US_MAP_HEIGHT, US_MAP_WIDTH } from '../utils/usMap';
import '../css/PrintView.css';

function StatesPrintView({ visitedStateNames = [], selectedIds = [], geoList = null }) {
  const visitedCount = visitedStateNames.length;
  const { projection, path } = useMemo(
    () => createUsMapPath(geoList || []),
    [geoList],
  );
  const date = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }), []);

  const visitedStates = useMemo(() => (
    visitedStateNames
      .map((name) => {
        const abbr = STATE_ABBR[name];
        return abbr ? { fullName: name, abbr } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  ), [visitedStateNames]);

  return (
    <div className="print-view states-print">
      <div className="print-header">
        <h1 className="print-title">U.S. States I've Visited</h1>
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
            {geoList && geoList.length > 0 && (
              <div className="print-map-wrapper">
                <svg
                  className="print-map"
                  viewBox={`0 0 ${US_MAP_WIDTH} ${US_MAP_HEIGHT}`}
                  role="img"
                  aria-label="Map of visited U.S. states"
                >
                  {geoList.map((geo) => {
                    const statePath = path(geo);
                    const isSelected = isStateSelected(selectedIds, geo.id);
                    const centroid = geoCentroid(geo);
                    const screenCoord = Array.isArray(centroid) ? projection(centroid) : null;
                    const hasLabelCoord =
                      Array.isArray(screenCoord) &&
                      screenCoord.every((value) => Number.isFinite(value));

                    if (!statePath) {
                      return null;
                    }

                    return (
                      <React.Fragment key={geo.id}>
                        <path
                          d={statePath}
                          className={`print-state ${isSelected ? "print-state--visited" : ""}`}
                          fill={isSelected ? '#4f7d69' : '#e8e8e8'}
                          stroke="#ffffff"
                          strokeWidth="0.5"
                        />
                        {hasLabelCoord && (
                          <text
                            className="print-statename"
                            fill="#222222"
                            fontFamily="Inter, system-ui, sans-serif"
                            fontSize="8"
                            fontWeight="800"
                            stroke="rgba(255, 255, 255, 0.86)"
                            strokeLinejoin="round"
                            strokeWidth="2.2"
                            x={screenCoord[0]}
                            y={screenCoord[1]}
                            textAnchor="middle"
                            aria-hidden="true"
                          >
                            {STATE_ABBR[geo.properties.name] || geo.properties.name}
                          </text>
                        )}
                      </React.Fragment>
                    );
                  })}
                </svg>
              </div>
            )}

            <div className="print-states-grid">
              {visitedStates.map(({ fullName, abbr }) => (
                <span key={abbr} className="print-state-item">
                  {abbr} - {fullName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="print-footer">
        <p className="print-signature">Travel Tracker</p>
      </div>
    </div>
  );
}

export default StatesPrintView;
