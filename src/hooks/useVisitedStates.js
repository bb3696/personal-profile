import { useCallback, useEffect, useMemo, useState } from 'react';
import { createStateIdSet, normalizeStateId } from '../utils/usMap';
import { readJsonStorage, writeJsonStorage } from '../utils/storage';

const VISITED_STATES_KEY = 'visitedStates';

function readVisitedStates() {
  const storedStates = readJsonStorage(VISITED_STATES_KEY, []);
  return Array.isArray(storedStates) ? storedStates : [];
}

export function useVisitedStates() {
  const [selectedStateIds, setSelectedStateIds] = useState(readVisitedStates);

  const selectedIdSet = useMemo(
    () => createStateIdSet(selectedStateIds),
    [selectedStateIds],
  );

  useEffect(() => {
    writeJsonStorage(VISITED_STATES_KEY, selectedStateIds);
  }, [selectedStateIds]);

  const clearVisitedStates = useCallback(() => {
    setSelectedStateIds([]);
  }, []);

  const toggleState = useCallback((stateId) => {
    setSelectedStateIds((currentStateIds) => {
      const normalizedId = normalizeStateId(stateId);
      const alreadySelected = currentStateIds.some((id) => normalizeStateId(id) === normalizedId);

      if (alreadySelected) {
        return currentStateIds.filter((id) => normalizeStateId(id) !== normalizedId);
      }

      return [...currentStateIds, stateId];
    });
  }, []);

  const applyStatePreset = useCallback((stateIds, shouldUsePreset) => {
    setSelectedStateIds((currentStateIds) => {
      const nextStateIdsById = new Map(
        currentStateIds.map((stateId) => [normalizeStateId(stateId), stateId]),
      );

      stateIds.forEach((stateId) => {
        const normalizedId = normalizeStateId(stateId);

        if (shouldUsePreset) {
          nextStateIdsById.set(normalizedId, stateId);
        } else {
          nextStateIdsById.delete(normalizedId);
        }
      });

      return Array.from(nextStateIdsById.values());
    });
  }, []);

  return {
    applyStatePreset,
    clearVisitedStates,
    selectedCount: selectedStateIds.length,
    selectedIdSet,
    selectedStateIds,
    toggleState,
  };
}
