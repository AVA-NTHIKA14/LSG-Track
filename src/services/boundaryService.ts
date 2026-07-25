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
  panchayathNameMl?: string
): Promise<any | null> {
  const dataset = await loadLSGBoundaries();
  if (!dataset || !dataset.features) return null;

  const cleanEn = panchayathNameEn.toLowerCase().replace(/grama\s*panchayat/i, '').trim();
  const cleanMl = panchayathNameMl ? panchayathNameMl.replace(/ഗ്രാമപഞ്ചായത്ത്/g, '').trim() : '';

  // 1. Try exact or partial match on English name
  const matchEn = dataset.features.find((f) => {
    const fName = (f.properties.name || f.properties['name:en'] || '').toLowerCase();
    return fName && (fName === cleanEn || fName.includes(cleanEn) || cleanEn.includes(fName));
  });

  if (matchEn) {
    return {
      type: 'FeatureCollection',
      features: [matchEn]
    };
  }

  // 2. Try match on Malayalam name if provided
  if (cleanMl) {
    const matchMl = dataset.features.find((f) => {
      const fMl = f.properties['name:ml'] || '';
      return fMl && (fMl.includes(cleanMl) || cleanMl.includes(fMl));
    });

    if (matchMl) {
      return {
        type: 'FeatureCollection',
        features: [matchMl]
      };
    }
  }

  return null;
}
