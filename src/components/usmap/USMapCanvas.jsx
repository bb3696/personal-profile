import React, { useMemo } from 'react';
import { geoCentroid } from 'd3-geo';
import { STATE_ABBR } from '../../data/stateList';
import { isStateSelected, US_MAP_HEIGHT, US_MAP_WIDTH } from '../../utils/usMap';

function USMapCanvas({
  geoList,
  isLoading,
  mapError,
  onToggleState,
  path,
  projection,
  searchText,
  selectedIdSet,
}) {
  const normalizedSearch = searchText.trim().toLowerCase();

  const statusText = useMemo(() => {
    if (isLoading) {
      return 'Loading map...';
    }

    if (mapError) {
      return mapError;
    }

    if (geoList?.length === 0) {
      return 'No states match the current filters.';
    }

    return '';
  }, [geoList, isLoading, mapError]);

  return (
    <svg
      className="usmap-svg"
      viewBox={`0 0 ${US_MAP_WIDTH} ${US_MAP_HEIGHT}`}
      role="img"
      aria-label="Interactive map of visited U.S. states"
    >
      {statusText && (
        <text className="map-status" x="50%" y="50%" textAnchor="middle">
          {statusText}
        </text>
      )}

      {geoList?.map((geo) => {
        const stateName = geo.properties.name;
        const stateAbbr = STATE_ABBR[stateName] || stateName;
        const isSelected = isStateSelected(selectedIdSet, geo.id);
        const isSearchMatched =
          normalizedSearch !== '' &&
          `${stateName} ${stateAbbr}`.toLowerCase().includes(normalizedSearch);
        const centroid = geoCentroid(geo);
        const screenCoord = Array.isArray(centroid) ? projection(centroid) : null;
        const hasLabelCoord =
          Array.isArray(screenCoord) &&
          screenCoord.every((value) => Number.isFinite(value));
        const statePath = path(geo);

        if (!statePath) {
          return null;
        }

        return (
          <React.Fragment key={geo.id}>
            <path
              d={statePath}
              onClick={() => onToggleState(geo.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggleState(geo.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`${stateName}: ${isSelected ? 'visited' : 'not visited'}`}
              className={[
                'state-default',
                isSelected ? 'state-visited' : '',
                isSearchMatched ? 'state-search' : '',
              ].filter(Boolean).join(' ')}
            />
            {hasLabelCoord && (
              <text
                className="statename"
                x={screenCoord[0]}
                y={screenCoord[1]}
                textAnchor="middle"
                aria-hidden="true"
              >
                {stateAbbr}
              </text>
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
}

export default React.memo(USMapCanvas);
