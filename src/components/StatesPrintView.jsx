import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoCentroid, geoAlbersUsa } from 'd3-geo';
import { Annotation } from 'react-simple-maps';
import { STATE_ABBR } from '../data/stateList';
import '../css/PrintView.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

function StatesPrintView({ visitedStateNames = [], selectedIds = [], geoList = null }) {
  const visitedCount = visitedStateNames.length;
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // 已访问的州列表（按字母顺序）
  const visitedStates = visitedStateNames
    .map((name) => {
      const abbr = STATE_ABBR[name];
      return abbr ? { fullName: name, abbr } : null;
    })
    .filter(Boolean)
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
            
            {/* 打印地图 */}
            {geoList && geoList.length > 0 && (
              <div className="print-map-wrapper">
                <ComposableMap projection="geoAlbersUsa" className="print-map">
                  <Geographies geography={geoUrl}>
                    {({ geographies }) => {
                      const projection = geoAlbersUsa();
                      return geographies.map((geo) => {
                        const isSelected = selectedIds.includes(geo.id);
                        const centroid = geoCentroid(geo.geometry);
                        const isValidCentroid =
                          Array.isArray(centroid) &&
                          centroid.length === 2 &&
                          !centroid.includes(undefined);
                        const screenCoord = isValidCentroid
                          ? projection(centroid)
                          : null;

                        return (
                          <React.Fragment key={geo.rsmKey}>
                            <Geography
                              geography={geo}
                              fill={isSelected ? "#ff6347" : "#ffeeda"}
                              stroke="#fff"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: "none" },
                                hover: { outline: "none" },
                                pressed: { outline: "none" },
                              }}
                            />
                            {screenCoord && (
                              <Annotation
                                subject={centroid}
                                dx={0}
                                dy={0}
                                connectorProps={{ stroke: "none" }}
                              >
                                <text
                                  className="print-statename"
                                  x={0}
                                  y={0}
                                  textAnchor="middle"
                                  fontSize={8}
                                  fill="#111"
                                >
                                  {STATE_ABBR[geo.properties.name] || geo.properties.name}
                                </text>
                              </Annotation>
                            )}
                          </React.Fragment>
                        );
                      });
                    }}
                  </Geographies>
                </ComposableMap>
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
        <p className="print-signature">Tony Yang</p>
      </div>
    </div>
  );
}

export default StatesPrintView;
