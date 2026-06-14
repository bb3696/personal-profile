import React, { useCallback, useMemo, useState } from 'react';
import { PARK_NAMES } from '../data/parkList';
import SearchToggleBar from '../components/SearchToggleBar';
import ParksPrintView from '../components/ParksPrintView';
import TopNav from '../components/TopNav';
import PageHeader from '../components/common/PageHeader';
import PrintModal from '../components/common/PrintModal';
import ParksGrid from '../components/parks/ParksGrid';
import { useInteractiveBackground } from '../hooks/useInteractiveBackground';
import { usePrintMode } from '../hooks/usePrintMode';
import { useVisitedParks } from '../hooks/useVisitedParks';
import '../css/Parks.css';

function Parks() {
  const [searchText, setSearchText] = useState('');
  const [showVisitedOnly, setShowVisitedOnly] = useState(false);
  const {
    applyPreset,
    clearVisited,
    presetValue,
    toggleVisited,
    visitedCount,
    visitedParks,
  } = useVisitedParks();
  const { closePrint, isPrintOpen, openPrint } = usePrintMode();

  useInteractiveBackground();

  const normalizedSearch = searchText.trim().toLowerCase();

  const filteredParks = useMemo(() => PARK_NAMES.filter((name) => {
    const matchesSearch = name.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) return false;

    return showVisitedOnly ? visitedParks.has(name) : true;
  }), [normalizedSearch, showVisitedOnly, visitedParks]);

  const totalParks = PARK_NAMES.length;

  const handleClear = useCallback(() => {
    clearVisited();
    setShowVisitedOnly(false);
  }, [clearVisited]);

  return (
    <main className="parks-page">
      <PrintModal
        onClose={closePrint}
        open={isPrintOpen}
        title="National parks export"
      >
        <ParksPrintView />
      </PrintModal>

      <div className={`parks-page-chrome ${isPrintOpen ? 'no-print' : ''}`}>
        <TopNav />
        <PageHeader
          countLabel={`(${visitedCount} / ${totalParks})`}
          description="A personal checklist of the national parks I have visited, with search, filters, photos, and a downloadable snapshot."
          eyebrow="Travel Log"
          title="National Parks I've Visited"
        />

        <SearchToggleBar
          onClear={handleClear}
          onPresetChange={applyPreset}
          onPrint={openPrint}
          placeholder="Search parks..."
          presetValue={presetValue}
          searchText={searchText}
          setSearchText={setSearchText}
          showVisitedOnly={showVisitedOnly}
          setShowVisitedOnly={setShowVisitedOnly}
        />

        <ParksGrid
          onToggleVisited={toggleVisited}
          parks={filteredParks}
          visitedParks={visitedParks}
        />
      </div>
    </main>
  );
}

export default Parks;
