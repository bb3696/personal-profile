import { useEffect, useState } from 'react';
import { extractStateFeatures } from '../utils/usMap';

const US_STATES_TOPOLOGY_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export function useUsMapData() {
  const [geoList, setGeoList] = useState(null);
  const [mapError, setMapError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    setMapError('');

    fetch(US_STATES_TOPOLOGY_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Map request failed: ${response.status}`);
        }

        return response.json();
      })
      .then((topology) => {
        setGeoList(extractStateFeatures(topology));
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }

        setGeoList([]);
        setMapError('Unable to load map data.');
      });

    return () => {
      controller.abort();
    };
  }, []);

  return {
    geoList,
    isMapLoading: geoList === null && mapError === '',
    mapError,
  };
}
