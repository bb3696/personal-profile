import React, { useCallback, useMemo, useState } from 'react';
import SearchToggleBar from '../components/SearchToggleBar';
import { DEFAULT_VISITED_STATES, STATE_ABBR } from '../data/stateList';
import StatesPrintView from '../components/StatesPrintView';
import TopNav from '../components/TopNav';
import PageHeader from '../components/common/PageHeader';
import PrintModal from '../components/common/PrintModal';
import USMapCanvas from '../components/usmap/USMapCanvas';
import { useInteractiveBackground } from '../hooks/useInteractiveBackground';
import { usePrintMode } from '../hooks/usePrintMode';
import { useUsMapData } from '../hooks/useUsMapData';
import { useVisitedStates } from '../hooks/useVisitedStates';
import {
  createUsMapPath,
  getDefaultVisitedStateIds,
  isStateSelected,
} from '../utils/usMap';
import '../css/USMap.css';

const TOTAL_US_STATES = 50;

const USMap = () => {
  const [searchText, setSearchText] = useState('');
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const {
    applyStatePreset,
    clearVisitedStates,
    selectedCount,
    selectedIdSet,
    selectedStateIds,
    toggleState,
  } = useVisitedStates();
  const { geoList, isMapLoading, mapError } = useUsMapData();
  const { closePrint, isPrintOpen, openPrint } = usePrintMode(geoList ? 300 : 1000);

  useInteractiveBackground();

  const { projection, path } = useMemo(
    () => createUsMapPath(geoList || []),
    [geoList],
  );

  const tonyStateIds = useMemo(
    () => getDefaultVisitedStateIds(geoList, DEFAULT_VISITED_STATES, STATE_ABBR),
    [geoList],
  );

  const presetValue = useMemo(
    () => (
      tonyStateIds.length > 0 && tonyStateIds.every((stateId) => isStateSelected(selectedIdSet, stateId))
        ? 'tony'
        : 'custom'
    ),
    [selectedIdSet, tonyStateIds],
  );

  const filteredGeoList = useMemo(() => {
    if (!geoList) {
      return geoList;
    }

    return geoList.filter((geo) => (
      showVisitedOnly ? isStateSelected(selectedIdSet, geo.id) : true
    ));
  }, [geoList, selectedIdSet, showVisitedOnly]);

  const visitedStateNames = useMemo(() => {
    if (!geoList || selectedStateIds.length === 0) {
      return [];
    }

    return geoList
      .filter((geo) => isStateSelected(selectedIdSet, geo.id))
      .map((geo) => geo.properties.name)
      .filter(Boolean);
  }, [geoList, selectedIdSet, selectedStateIds.length]);

  const handlePresetChange = useCallback((value) => {
    applyStatePreset(tonyStateIds, value === 'tony');
  }, [applyStatePreset, tonyStateIds]);

  const handleClear = useCallback(() => {
    clearVisitedStates();
    setShowVisitedOnly(false);
  }, [clearVisitedStates]);

  return (
    <main className="usmap-container">
      <PrintModal
        onClose={closePrint}
        open={isPrintOpen}
        title="U.S. states export"
      >
        <StatesPrintView
          geoList={geoList}
          selectedIds={selectedStateIds}
          visitedStateNames={visitedStateNames}
        />
      </PrintModal>

      <div className={`usmap-page-chrome ${isPrintOpen ? 'no-print' : ''}`}>
        <TopNav />
        <PageHeader
          countLabel={`(${selectedCount} / ${TOTAL_US_STATES})`}
          description="An interactive map showing the states I have traveled to across the U.S., with search and a downloadable summary."
          eyebrow="Travel Log"
          title="U.S. States I've Visited"
        />

        <SearchToggleBar
          onClear={handleClear}
          onPresetChange={handlePresetChange}
          onPrint={openPrint}
          placeholder="Search states..."
          presetValue={presetValue}
          searchText={searchText}
          setSearchText={setSearchText}
          showVisitedOnly={showVisitedOnly}
          setShowVisitedOnly={setShowVisitedOnly}
        />
      </div>

      <div className={`usmap-map-wrapper reveal-up ${isPrintOpen ? 'no-print' : ''}`}>
        <USMapCanvas
          geoList={filteredGeoList}
          isLoading={isMapLoading}
          mapError={mapError}
          onToggleState={toggleState}
          path={path}
          projection={projection}
          searchText={searchText}
          selectedIdSet={selectedIdSet}
        />
      </div>
    </main>
  );
};

export default USMap;
