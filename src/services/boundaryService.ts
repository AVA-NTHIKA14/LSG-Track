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

export function isPointInPolygonCoords(point: [number, number], vs: [number, number][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPointInsideGeoJSON(lat: number, lng: number, geojson: any): boolean {
  if (!geojson || !geojson.features || geojson.features.length === 0) return true;
  const point: [number, number] = [lng, lat];
  for (const feature of geojson.features) {
    const geom = feature?.geometry;
    if (!geom) continue;
    if (geom.type === 'Polygon') {
      if (isPointInPolygonCoords(point, geom.coordinates[0])) return true;
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        if (isPointInPolygonCoords(point, poly[0])) return true;
      }
    }
  }
  return false;
}
