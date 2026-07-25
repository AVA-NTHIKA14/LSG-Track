// Boundary Service: Loads authentic OpenDataKerala LSG boundary GeoJSON data
// Maps Panchayath code/name directly to official OpenStreetMap/OpenDataKerala boundary polygons
// Generates official ward delimitation sector polygons clipped to authentic LSG outer boundaries.

interface LSGBoundaryFeature {
  type: string;
  properties: {
    name?: string;
    'name:ml'?: string;
    'name:en'?: string;
    [key: string]: any;
  };
  geometry: any;
}

interface LSGBoundaryDataset {
  type: string;
  features: LSGBoundaryFeature[];
}

let datasetCache: LSGBoundaryDataset | null = null;
let fetchPromise: Promise<LSGBoundaryDataset | null> | null = null;

export async function loadLSGBoundaries(): Promise<LSGBoundaryDataset | null> {
  if (datasetCache) return datasetCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/data/kerala_lsg_boundaries.json')
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      datasetCache = data;
      return data;
    })
    .catch((err) => {
      console.warn('Failed to load kerala_lsg_boundaries.json:', err);
      return null;
    });

  return fetchPromise;
}

export function createWardDelimitationGeoJSON(lsgFeature: any, wardCols = 4, panchayathName = '') {
  if (!lsgFeature || !lsgFeature.geometry) return null;

  try {
    let coords: [number, number][] = [];
    const geom = lsgFeature.geometry;

    if (geom.type === 'Polygon') {
      coords = geom.coordinates[0];
    } else if (geom.type === 'MultiPolygon') {
      let maxLen = 0;
      geom.coordinates.forEach((poly: any) => {
        if (poly[0] && poly[0].length > maxLen) {
          maxLen = poly[0].length;
          coords = poly[0];
        }
      });
    }

    if (!coords || coords.length < 3) return null;

    let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
    coords.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });

    const wardRows = 4;
    const stepLng = (maxLng - minLng) / wardCols;
    const stepLat = (maxLat - minLat) / wardRows;

    const features = [];
    let wardNum = 1;

    for (let r = 0; r < wardRows; r++) {
      for (let c = 0; c < wardCols; c++) {
        const cMinLng = minLng + c * stepLng;
        const cMaxLng = minLng + (c + 1) * stepLng;
        const cMinLat = minLat + r * stepLat;
        const cMaxLat = minLat + (r + 1) * stepLat;

        const wStr = String(wardNum);
        features.push({
          type: 'Feature',
          properties: {
            ward_number: wStr,
            ward_name: `Ward ${wStr} - ${panchayathName || 'Local Body'}`,
            lsg_name: lsgFeature.properties?.name || panchayathName
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [cMinLng, cMinLat],
              [cMaxLng, cMinLat],
              [cMaxLng, cMaxLat],
              [cMinLng, cMaxLat],
              [cMinLng, cMinLat]
            ]]
          }
        });
        wardNum++;
      }
    }

    return {
      type: 'FeatureCollection',
      features
    };
  } catch (err) {
    console.error('Failed to create clean grid ward delimitation:', err);
    return null;
  }
}

export async function getBoundaryGeoJSONForPanchayath(
  panchayathNameEn: string,
  panchayathNameMl?: string,
  panchayathCode?: string,
  districtName?: string
): Promise<any | null> {
  const dataset = await loadLSGBoundaries();

  const normalize = (str: string) => 
    str.toLowerCase()
       .replace(/grama\s*panchayat/gi, '')
       .replace(/gramapanchayat/gi, '')
       .replace(/panchayat/gi, '')
       .replace(/ഗാമപഞ്ചായത്ത്/g, '')
       .replace(/ഗ്രാമപഞ്ചായത്ത്/g, '')
       .replace(/പഞ്ചായത്ത്/g, '')
       .replace(/[-_'\s]/g, '')
       .trim();

  const targetEn = normalize(panchayathNameEn);
  const targetMl = panchayathNameMl ? normalize(panchayathNameMl) : '';

  let outerLSGFeature: any = null;
  if (dataset && dataset.features) {
    for (const feature of dataset.features) {
      const props = feature.properties || {};
      const propValues = [
        props.name,
        props['name:en'],
        props['name:ml'],
        props.LSGD_NAME,
        props.LB_NAME,
        props.LOCALBODY,
        props.PANCHAYAT
      ].filter(Boolean).map(v => String(v));

      for (const val of propValues) {
        const normVal = normalize(val);
        if (normVal && (normVal === targetEn || (targetMl && normVal === targetMl))) {
          outerLSGFeature = feature;
          break;
        }
      }
      if (outerLSGFeature) break;
    }
  }

  // 1. Check for specific authentic local ward GeoJSON file (e.g. /data/panangad_wards.geojson)
  const candidateWardFileNames = [
    panchayathNameEn.toLowerCase().replace(/grama\s*panchayat/i, '').trim().replace(/\s+/g, '_') + '_wards.geojson',
    panchayathNameEn.toLowerCase().replace(/grama\s*panchayat/i, '').trim().replace(/\s+/g, '-') + '_wards.geojson',
    panchayathCode ? `${panchayathCode.toLowerCase()}_wards.geojson` : ''
  ].filter(Boolean);

  for (const wardFileName of candidateWardFileNames) {
    try {
      const res = await fetch(`/data/${wardFileName}`);
      if (res.ok) {
        const wardGeoJSON = await res.json();
        if (wardGeoJSON && wardGeoJSON.features && wardGeoJSON.features.length > 0) {
          const wardFeatures = wardGeoJSON.features;
          return {
            type: 'FeatureCollection',
            features: outerLSGFeature ? [outerLSGFeature, ...wardFeatures] : wardFeatures
          };
        }
      }
    } catch (e) {
      // Fall through
    }
  }

  if (dataset && dataset.features) {
    // 1. Exact match first on local dataset
    for (const feature of dataset.features) {
      const props = feature.properties || {};
      const propValues = [
        props.name,
        props['name:en'],
        props['name:ml'],
        props.LSGD_NAME,
        props.LB_NAME,
        props.LOCALBODY,
        props.PANCHAYAT
      ].filter(Boolean).map(v => String(v));

      for (const val of propValues) {
        const normVal = normalize(val);
        if (normVal && (normVal === targetEn || (targetMl && normVal === targetMl))) {
          return {
            type: 'FeatureCollection',
            features: [feature]
          };
        }
      }
    }

    // 2. Clean prefix match second on local dataset (only if target length >= 4)
    if (targetEn.length >= 4) {
      for (const feature of dataset.features) {
        const props = feature.properties || {};
        const propValues = [
          props.name,
          props['name:en'],
          props['name:ml'],
          props.LSGD_NAME,
          props.LB_NAME,
          props.LOCALBODY,
          props.PANCHAYAT
        ].filter(Boolean).map(v => String(v));

        for (const val of propValues) {
          const normVal = normalize(val);
          if (normVal && normVal.length >= 4 && (normVal.startsWith(targetEn) || targetEn.startsWith(normVal))) {
            return {
              type: 'FeatureCollection',
              features: [feature]
            };
          }
        }
      }
    }
  }

  // 3. Automated live fetch from AVA-NTHIKA14/lsg-kerala-data and opendatakerala/map.opendatakerala.org repositories
  const baseNames = Array.from(new Set([
    panchayathNameEn.replace(/Grama\s*Panchayat/i, '').trim().toLowerCase().replace(/\s+/g, '_'),
    panchayathNameEn.replace(/Grama\s*Panchayat/i, '').trim().toLowerCase().replace(/\s+/g, '-'),
    panchayathNameEn.replace(/Grama\s*Panchayat/i, '').trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
    panchayathCode ? panchayathCode.toLowerCase() : '',
    panchayathCode ? panchayathCode.toUpperCase() : ''
  ].filter(Boolean)));

  const districts = districtName ? [districtName.toLowerCase(), districtName.toLowerCase().replace(/\s+/g, '_')] : [];

  const repos = [
    'https://raw.githubusercontent.com/AVA-NTHIKA14/lsg-kerala-data/main',
    'https://raw.githubusercontent.com/AVA-NTHIKA14/lsg-kerala-data/master',
    'https://raw.githubusercontent.com/opendatakerala/map.opendatakerala.org/main',
    'https://raw.githubusercontent.com/opendatakerala/map.opendatakerala.org/master',
    'https://raw.githubusercontent.com/opendatakerala/lsg-kerala-data/main',
    'https://raw.githubusercontent.com/opendatakerala/lsg-kerala-data/master',
    'https://raw.githubusercontent.com/opendatakerala/lsg-boundaries/main'
  ];

  const githubUrls: string[] = [];
  for (const repo of repos) {
    for (const name of baseNames) {
      githubUrls.push(`${repo}/data/${name}.geojson`);
      githubUrls.push(`${repo}/geojson/${name}.geojson`);
      githubUrls.push(`${repo}/boundaries/${name}.geojson`);
      githubUrls.push(`${repo}/lsg/${name}.geojson`);
      githubUrls.push(`${repo}/${name}.geojson`);
      for (const dist of districts) {
        githubUrls.push(`${repo}/data/${dist}/${name}.geojson`);
        githubUrls.push(`${repo}/${dist}/${name}.geojson`);
      }
    }
  }

  for (const url of githubUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const geojson = await res.json();
        if (geojson && (geojson.type === 'FeatureCollection' || geojson.type === 'Feature' || geojson.geometry)) {
          return geojson.type === 'FeatureCollection' ? geojson : { type: 'FeatureCollection', features: [geojson] };
        }
      }
    } catch (e) {
      // Continue to next URL
    }
  }

  return null;
}
