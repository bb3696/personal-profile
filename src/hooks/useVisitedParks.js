import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_VISITED, PARK_NAMES } from '../data/parkList';
import { readStorageItem, removeStorageItem, writeStorageItem } from '../utils/storage';

const getParkStorageKey = (parkName) => `visited_${parkName}`;

function readVisitedParks() {
  return new Set(
    PARK_NAMES.filter((parkName) => readStorageItem(getParkStorageKey(parkName)) === 'true'),
  );
}

export function isParkVisited(parkName) {
  return readStorageItem(getParkStorageKey(parkName)) === 'true';
}

export function useVisitedParks() {
  const [visitedParks, setVisitedParks] = useState(readVisitedParks);

  const presetParks = useMemo(
    () => DEFAULT_VISITED.filter((parkName) => PARK_NAMES.includes(parkName)),
    [],
  );

  const presetValue = useMemo(
    () => (
      presetParks.length > 0 && presetParks.every((parkName) => visitedParks.has(parkName))
        ? 'tony'
        : 'custom'
    ),
    [presetParks, visitedParks],
  );

  const toggleVisited = useCallback((parkName) => {
    setVisitedParks((currentVisitedParks) => {
      const nextVisitedParks = new Set(currentVisitedParks);
      const nextValue = !nextVisitedParks.has(parkName);

      if (nextValue) {
        nextVisitedParks.add(parkName);
      } else {
        nextVisitedParks.delete(parkName);
      }

      writeStorageItem(getParkStorageKey(parkName), String(nextValue));
      return nextVisitedParks;
    });
  }, []);

  const clearVisited = useCallback(() => {
    PARK_NAMES.forEach((parkName) => removeStorageItem(getParkStorageKey(parkName)));
    setVisitedParks(new Set());
  }, []);

  const applyPreset = useCallback((value) => {
    const shouldUsePreset = value === 'tony';

    setVisitedParks((currentVisitedParks) => {
      const nextVisitedParks = new Set(currentVisitedParks);

      presetParks.forEach((parkName) => {
        if (shouldUsePreset) {
          nextVisitedParks.add(parkName);
          writeStorageItem(getParkStorageKey(parkName), 'true');
        } else {
          nextVisitedParks.delete(parkName);
          removeStorageItem(getParkStorageKey(parkName));
        }
      });

      return nextVisitedParks;
    });
  }, [presetParks]);

  return {
    applyPreset,
    clearVisited,
    presetValue,
    toggleVisited,
    visitedCount: visitedParks.size,
    visitedParks,
  };
}
