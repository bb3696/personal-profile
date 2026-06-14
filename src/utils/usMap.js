import { geoAlbersUsa, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

export const US_MAP_WIDTH = 975;
export const US_MAP_HEIGHT = 610;

export function extractStateFeatures(topology) {
  if (!topology?.objects?.states) {
    return [];
  }

  return feature(topology, topology.objects.states).features;
}

export function createUsMapPath(features) {
  const projection = geoAlbersUsa();

  if (features?.length > 0) {
    projection.fitSize(
      [US_MAP_WIDTH, US_MAP_HEIGHT],
      { type: 'FeatureCollection', features },
    );
  }

  return {
    projection,
    path: geoPath(projection),
  };
}

export function normalizeStateId(stateId) {
  return String(stateId);
}

export function createStateIdSet(selectedIds) {
  return new Set((selectedIds || []).map(normalizeStateId));
}

export function isStateSelected(selectedIds, stateId) {
  if (selectedIds instanceof Set) {
    return selectedIds.has(normalizeStateId(stateId));
  }

  return (selectedIds || []).some((id) => normalizeStateId(id) === normalizeStateId(stateId));
}

export function defaultStateMatchesGeo(defaultState, geo, stateAbbr) {
  const name = geo.properties.name;
  const abbr = stateAbbr[name];
  const geoId = geo.id;

  return (
    defaultState === name ||
    defaultState === abbr ||
    defaultState === geoId ||
    defaultState === String(geoId) ||
    Number(defaultState) === geoId
  );
}

export function getDefaultVisitedStateIds(geoList, defaultVisitedStates, stateAbbr) {
  if (!geoList || !Array.isArray(defaultVisitedStates)) {
    return [];
  }

  return geoList
    .filter((geo) => defaultVisitedStates.some((defaultState) => (
      defaultStateMatchesGeo(defaultState, geo, stateAbbr)
    )))
    .map((geo) => geo.id);
}
