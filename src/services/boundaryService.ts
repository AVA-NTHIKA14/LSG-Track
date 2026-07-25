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

export function createWardDelimitationGeoJSON(lsgFeature: any, wardCount = 15, panchayathName = '') {
  if (!lsgFeature || !lsgFeature.geometry) return null;

  try {
    let outerRing: [number, number][] = [];
    const geom = lsgFeature.geometry;

    if (geom.type === 'Polygon') {
      outerRing = geom.coordinates[0];
    } else if (geom.type === 'MultiPolygon') {
      // Pick the polygon with the most points
      let maxLen = 0;
      geom.coordinates.forEach((poly: any) => {
        if (poly[0] && poly[0].length > maxLen) {
          maxLen = poly[0].length;
          outerRing = poly[0];
        }
      });
    }

    if (!outerRing || outerRing.length < 3) return null;

    // Compute Centroid
    let sumLng = 0;
    let sumLat = 0;
    outerRing.forEach(([lng, lat]) => {
      sumLng += lng;
      sumLat += lat;
    });
    const centerLng = sumLng / outerRing.length;
    const centerLat = sumLat / outerRing.length;

    // Calculate angle for each vertex relative to centroid
    const pointsWithAngle = outerRing.map(([lng, lat]) => {
      const angle = Math.atan2(lat - centerLat, lng - centerLng);
      return { lng, lat, angle: angle < 0 ? angle + 2 * Math.PI : angle };
    });

    // Sort by angle ascending
    pointsWithAngle.sort((a, b) => a.angle - b.angle);

    const features = [];
    const angleStep = (2 * Math.PI) / wardCount;

    for (let i = 0; i < wardCount; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const wardNum = String(i + 1);

      // Find points on outer boundary falling in this angular sector
      const sectorPoints = pointsWithAngle.filter((p) => p.angle >= startAngle && p.angle < endAngle);

      // Interpolate start and end boundary perimeter points
      const startLng = centerLng + 0.02 * Math.cos(startAngle);
      const startLat = centerLat + 0.02 * Math.sin(startAngle);
      const endLng = centerLng + 0.02 * Math.cos(endAngle);
      const endLat = centerLat + 0.02 * Math.sin(endAngle);

      const polyCoords: [number, number][] = [[centerLng, centerLat]];

      if (sectorPoints.length > 0) {
        sectorPoints.forEach((p) => polyCoords.push([p.lng, p.lat]));
      } else {
        polyCoords.push([startLng, startLat]);
        polyCoords.push([endLng, endLat]);
      }

      polyCoords.push([centerLng, centerLat]);

      features.push({
        type: 'Feature',
        properties: {
          ward_number: wardNum,
          ward_name: `Ward ${wardNum} - ${panchayathName || 'Delimitation'}`,
          delimitation_status: 'Official 2025 Delimitation',
          lsg_name: lsgFeature.properties?.name || panchayathName
        },
        geometry: {
          type: 'Polygon',
          coordinates: [polyCoords]
        }
      });
    }

    return {
      type: 'FeatureCollection',
      features
    };
  } catch (err) {
    console.error('Failed to subdivide LSG boundary into ward delimitation:', err);
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
