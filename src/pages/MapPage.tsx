import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { dbService, getActivePanchayathId } from '../services/dbService';
import { authService } from '../services/authService';
import { getPanchayathByCode, getPanchayathCenterCoordinates } from '../data/keralaPanchayaths';
import { getBoundaryGeoJSONForPanchayath, isPointInsideGeoJSON } from '../services/boundaryService';
import type { BuildingRecord, WardRecord, LicenseRecord, SyncHistoryRecord, WhatsAppLogRecord } from '../types';
import { 
  Search, 
  Ruler, 
  X, 
  Filter, 
  Layers, 
  Download, 
  Printer, 
  Compass, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  MapPin,
  Maximize2,
  Bell,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export const MapPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const activeCircleRef = useRef<L.Circle | null>(null);
  const heatmapsGroupRef = useRef<L.LayerGroup | null>(null);
  
  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '12';
  const isWardMember = currentUser?.role === 'Ward Member';

  // Database States
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistoryRecord[]>([]);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppLogRecord[]>([]);
  const [panchayatName, setPanchayatName] = useState('Loading Panchayat...');
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState<any>(null);
  const [boundaryUnavailable, setBoundaryUnavailable] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>(isWardMember ? assignedWard : 'all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedInspectionStatus, setSelectedInspectionStatus] = useState<string>('all');

  // Floating Popovers Visibility States
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  const [showLayersPopover, setShowLayersPopover] = useState(false);
  const [showLegendPopover, setShowLegendPopover] = useState(false);

  // Context Slide Drawers (420px width)
  const [activeBuilding, setActiveBuilding] = useState<BuildingRecord | null>(null);
  const [activeWardObj, setActiveWardObj] = useState<WardRecord | null>(null);
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  // GIS Overlays States
  const [mapStyle, setMapStyle] = useState<'satellite' | 'road'>('satellite');
  const [showBoundaries, setShowBoundaries] = useState(true);
  
  // Heatmap layer visibility
  const [showUnlicensedHeat, setShowUnlicensedHeat] = useState(false);
  const [showInspectionHeat, setShowInspectionHeat] = useState(false);
  const [showBusinessDensity, setShowBusinessDensity] = useState(false);
  const [showRenewalHeat, setShowRenewalHeat] = useState(false);

  // Layer toggles for markers
  const [showLicensedMarkers, setShowLicensedMarkers] = useState(true);
  const [showUnlicensedMarkers, setShowUnlicensedMarkers] = useState(true);
  const [showNgoMarkers, setShowNgoMarkers] = useState(true);
  const [showExpiringMarkers, setShowExpiringMarkers] = useState(true);
  const [showPendingMarkers, setShowPendingMarkers] = useState(true);

  // Measurement State
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureLine, setMeasureLine] = useState<L.Polyline | null>(null);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [, setMeasurePoints] = useState<L.LatLng[]>([]);

  // Simulation Status States
  const [whatsappStatus, setWhatsappStatus] = useState<string | null>(null);
  const [whatsappRecipient, setWhatsappRecipient] = useState('7025643678');
  const [surveySyncStatus, setSurveySyncStatus] = useState<string | null>(null);

  // K-SMART Ward Delimitation Modal State
  const [showKsmartModal, setShowKsmartModal] = useState(false);

  // Manual Pin Placement State (Bug 2 Fix)
  const [placingBuildingId, setPlacingBuildingId] = useState<string | null>(null);

  const activePanchayatCode = getActivePanchayathId();

  // Compute unplaced or out-of-boundary buildings
  const unplacedBuildings = buildings.filter(b => {
    if (b.needsManualPlacement) return true;
    if (boundaryGeoJSON && b.coordinates?.lat && b.coordinates?.lng) {
      return !isPointInsideGeoJSON(b.coordinates.lat, b.coordinates.lng, boundaryGeoJSON);
    }
    return false;
  });

  // Handle map click during manual pin placement mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !placingBuildingId) return;
    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      await dbService.updateBuildingLocation(placingBuildingId, lat, lng);
      setPlacingBuildingId(null);
    };
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [placingBuildingId]);

  const getKsmartWardMapUrl = () => {
    const panchayathObj = getPanchayathByCode(activePanchayatCode);
    const district = panchayathObj?.district || 'Kozhikode';
    const name = panchayathObj?.name || panchayatName.replace(/Grama\s*Panchayat/i, '').trim();
    return `https://wardmap.ksmart.live/map?district=${encodeURIComponent(district)}&type=Grama%20Panchayat&localbody=${encodeURIComponent(name)}`;
  };

  // Immediate & dynamic resolution when activePanchayatCode or language changes
  useEffect(() => {
    const panchayathObj = getPanchayathByCode(activePanchayatCode);
    const resolvedName = panchayathObj 
      ? (i18n.language === 'ml' ? panchayathObj.nameMl : panchayathObj.name)
      : `Grama Panchayat (${activePanchayatCode})`;

    setPanchayatName(resolvedName);

    const centerCoords = getPanchayathCenterCoordinates(activePanchayatCode);
    if (mapRef.current) {
      mapRef.current.setView(centerCoords, 13);
    }

    setBoundaryUnavailable(false);
    let isMounted = true;

    async function resolveBoundary() {
      if (panchayathObj) {
        const authenticBoundary = await getBoundaryGeoJSONForPanchayath(
          panchayathObj.name,
          panchayathObj.nameMl,
          panchayathObj.code,
          panchayathObj.district
        );
        if (isMounted) {
          if (authenticBoundary) {
            setBoundaryGeoJSON(authenticBoundary);
          } else {
            setBoundaryGeoJSON(null);
            setBoundaryUnavailable(true);
          }
        }
      }
    }

    resolveBoundary();

    return () => {
      isMounted = false;
    };
  }, [activePanchayatCode, i18n.language]);

  // Subscribe to database collections
  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubLicenses = dbService.subscribeToLicenses(setLicenses);
    const unsubWards = dbService.subscribeToWards(setWards);
    const unsubSyncHistory = dbService.subscribeToSyncHistory(setSyncHistory);
    const unsubWhatsappLogs = dbService.subscribeToWhatsAppLogs(setWhatsappLogs);

    return () => {
      unsubBuildings();
      unsubLicenses();
      unsubWards();
      unsubSyncHistory();
      unsubWhatsappLogs();
    };
  }, [activePanchayatCode]);

  const location = useLocation();

  // URL query parameter filter listener (e.g. ?filter=expired or ?ward=12 or ?id=BLDG-101)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    const wardParam = params.get('ward');
    const idParam = params.get('id');

    if (filterParam) {
      if (filterParam === 'expired') setSelectedStatus('expiring');
      else if (filterParam === 'unlicensed') setSelectedStatus('unlicensed');
      else if (filterParam === 'licensed') setSelectedStatus('licensed');
    }
    if (wardParam) setSelectedWard(wardParam);

    if (idParam && buildings.length > 0) {
      const match = buildings.find(b => b.id.toLowerCase() === idParam.toLowerCase());
      if (match) {
        setActiveBuilding(match);
        mapRef.current?.setView([match.coordinates.lat, match.coordinates.lng], 16);
      }
    }
  }, [location.search, buildings]);

  // Automatically extract and set WhatsApp recipient from active building ownerName
  useEffect(() => {
    if (activeBuilding) {
      const clean = activeBuilding.ownerName.replace(/\s+/g, '');
      const match = clean.match(/\d{10}/);
      if (match) {
        setWhatsappRecipient(match[0]);
      } else {
        setWhatsappRecipient('7025643678');
      }
    }
  }, [activeBuilding]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current || (mapContainerRef.current as any)._leaflet_id) {
      return;
    }

    // Dynamically resolve center coordinates for selected Panchayath
    const initialCenter = getPanchayathCenterCoordinates(activePanchayatCode);

    const map = L.map(mapContainerRef.current, {
      doubleClickZoom: false,
      zoomControl: false 
    }).setView(initialCenter, 13);
    mapRef.current = map;

    // Base Tile layer: OpenStreetMap & CartoDB Positron
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors, Open Data Kerala (ODbL)'
    });

    const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Tiles &copy; Google Maps'
    });

    if (mapStyle === 'satellite') {
      googleSatellite.addTo(map);
    } else {
      osmLayer.addTo(map);
    }

    // Initialize marker and heatmap groups
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    const heatmapsGroup = L.layerGroup().addTo(map);
    heatmapsGroupRef.current = heatmapsGroup;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update geojson boundary layer when boundaryGeoJSON resolves
  useEffect(() => {
    if (!mapRef.current || !boundaryGeoJSON) return;

    // Remove old layer
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    try {
      const geoJsonLayer = L.geoJSON(boundaryGeoJSON, {
        filter: (feature) => {
          return !isWardMember || feature?.properties?.ward_number === assignedWard;
        },
        style: (feature) => {
          const wardNum = feature?.properties?.ward_number;
          if (!wardNum) {
            const isSat = mapStyle === 'satellite';
            return {
              color: isSat ? '#F59E0B' : '#0284C7',
              weight: isSat ? 5.0 : 4.5,
              opacity: showBoundaries ? 1.0 : 0.0,
              fillColor: isSat ? '#F59E0B' : '#0284C7',
              fillOpacity: showBoundaries ? (isSat ? 0.18 : 0.12) : 0.0
            };
          }

          const wardObj = wards.find(w => w.id === wardNum);
          const comp = (wardObj && wardObj.totalBuildings > 0) ? wardObj.compliancePercentage : 0;

          // Compliance Coloring Choropleth Spectrum
          let color = '#E11D48'; // High Contrast Red (Critical < 60%)
          if (comp >= 90) color = '#166534'; // High Contrast Dark Green (Excellent)
          else if (comp >= 80) color = '#15803D'; // High Contrast Light Green (Good)
          else if (comp >= 70) color = '#A16207'; // High Contrast Yellow/Brown (Needs Attention)
          else if (comp >= 60) color = '#C2410C'; // High Contrast Orange (Poor)

          const isSelected = selectedWard === wardNum;

          return {
            color: mapStyle === 'satellite' ? '#FACC15' : '#475569',
            weight: isSelected ? 3.5 : 1.2,
            dashArray: isSelected ? undefined : '3, 6',
            opacity: showBoundaries ? 0.85 : 0.0,
            fillColor: color,
            fillOpacity: showBoundaries ? (isSelected ? 0.25 : 0.08) : 0.0
          };
        },
        onEachFeature: (feature, layer) => {
          const props = feature?.properties || {};
          const wardNum = props.ward_number;

          if (!wardNum) {
            const displayName = props.name || props['name:en'] || panchayatName;
            layer.bindTooltip(`
              <div style="font-family:sans-serif;padding:4px;font-size:11px;font-weight:bold;color:#0f172a;">
                ${displayName}<br/>
                <span style="font-size:10px;color:#166534;">Authentic LSG Outer Boundary</span>
              </div>
            `, { permanent: false, direction: 'center' });
          } else {
            const wardObj = wards.find(w => w.id === wardNum);
            layer.bindTooltip(`
              <div style="font-family:sans-serif;padding:4px;font-size:11px;font-weight:bold;color:#0f172a;">
                Ward ${wardNum}: ${props.ward_name || `Ward ${wardNum}`}<br/>
                <span style="font-size:10px;color:#166534;">Compliance: ${wardObj?.compliancePercentage || 100}%</span>
              </div>
            `, { permanent: false, direction: 'center' });

            layer.on('click', () => {
              setSelectedWard(wardNum);
              setActiveBuilding(null); 
              setShowActivityDrawer(false); 
              if (wardObj) setActiveWardObj(wardObj);
            });
          }

          // Double Click zooms into locality
          layer.on('dblclick', (e) => {
            mapRef.current?.setView(e.latlng, 15);
          });
        }
      }).addTo(mapRef.current);
      geoJsonLayerRef.current = geoJsonLayer;
      
      // Fit Bounds dynamically
      if (geoJsonLayer.getBounds().isValid()) {
        mapRef.current.fitBounds(geoJsonLayer.getBounds());
      }
    } catch (err) {
      console.error('GeoJSON rendering error:', err);
    }
  }, [boundaryGeoJSON, showBoundaries, selectedWard, wards, mapStyle]);

  // Handle Base Map Layer Change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const googleSatellite = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Tiles &copy; Google Maps'
    });

    const googleRoadmap = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      attribution: 'Tiles &copy; Google Maps'
    });

    if (mapStyle === 'satellite') {
      googleSatellite.addTo(map);
    } else {
      googleRoadmap.addTo(map);
    }
  }, [mapStyle]);

  // Toggle Boundaries Visibility or Style Refresh on Selection Changes
  useEffect(() => {
    const geoJsonLayer = geoJsonLayerRef.current;
    if (!geoJsonLayer) return;

    geoJsonLayer.setStyle((feature) => {
      const wardNum = feature?.properties?.ward_number;
      if (!wardNum) {
        // Authentic Outer Panchayath Boundary Polygon (Bold Amber/Orange)
        return {
          color: '#F59E0B',
          weight: 4.5,
          opacity: showBoundaries ? 1.0 : 0.0,
          fillColor: '#F59E0B',
          fillOpacity: showBoundaries ? 0.08 : 0.0
        };
      }

      const wardObj = wards.find((w: WardRecord) => w.id === wardNum);
      const comp = wardObj ? wardObj.compliancePercentage : 75;

      let color = '#E11D48';
      if (comp >= 90) color = '#166534';
      else if (comp >= 80) color = '#15803D';
      else if (comp >= 70) color = '#A16207';
      else if (comp >= 60) color = '#C2410C';

      const isSelected = selectedWard === wardNum;

      return {
        color: isSelected ? '#3B82F6' : (mapStyle === 'satellite' ? '#FACC15' : '#D97706'),
        weight: isSelected ? 4.5 : 2.0,
        dashArray: isSelected ? undefined : '4, 6',
        opacity: showBoundaries ? 0.95 : 0.0,
        fillColor: color,
        fillOpacity: showBoundaries ? (isSelected ? 0.28 : 0.10) : 0.0
      };
    });
  }, [selectedWard, showBoundaries]);

  // Heatmaps Overlays Generator
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !heatmapsGroupRef.current) return;

    heatmapsGroupRef.current.clearLayers();

    // 1. Unlicensed Hotspots Density
    if (showUnlicensedHeat) {
      buildings.filter(b => b.status === 'unlicensed').forEach(b => {
        L.circle(b.coordinates, {
          radius: 350,
          color: '#E11D48',
          fillColor: '#E11D48',
          fillOpacity: 0.15,
          weight: 0,
          interactive: false
        }).addTo(heatmapsGroupRef.current!);
      });
    }

    // 2. Pending Inspection Hotspots
    if (showInspectionHeat) {
      buildings.filter(b => b.status === 'pending').forEach(b => {
        L.circle(b.coordinates, {
          radius: 400,
          color: '#2563EB',
          fillColor: '#2563EB',
          fillOpacity: 0.13,
          weight: 0,
          interactive: false
        }).addTo(heatmapsGroupRef.current!);
      });
    }

    // 3. Overall Commercial Enterprise Density
    if (showBusinessDensity) {
      buildings.forEach(b => {
        L.circle(b.coordinates, {
          radius: 450,
          color: '#15803D',
          fillColor: '#15803D',
          fillOpacity: 0.09,
          weight: 0,
          interactive: false
        }).addTo(heatmapsGroupRef.current!);
      });
    }

    // 4. Renewal Concentration Hotspots
    if (showRenewalHeat) {
      const expiredBldgs = buildings.filter(b => {
        const lic = licenses.find(l => l.buildingId === b.id);
        return lic && lic.status === 'expired';
      });
      expiredBldgs.forEach(b => {
        L.circle(b.coordinates, {
          radius: 380,
          color: '#C2410C',
          fillColor: '#C2410C',
          fillOpacity: 0.14,
          weight: 0,
          interactive: false
        }).addTo(heatmapsGroupRef.current!);
      });
    }
  }, [showUnlicensedHeat, showInspectionHeat, showBusinessDensity, showRenewalHeat, buildings, licenses]);

  // Refresh Markers on Data/Filter Changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    // Smart filter constraints
    const filteredBuildings = buildings.filter(b => {
      const matchSearch = 
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const bldgLic = licenses.find(l => l.buildingId === b.id);
      
      let finalStatus: string = b.status;
      if (b.status === 'licensed' && bldgLic && bldgLic.status === 'expired') {
        finalStatus = 'expiring';
      }

      // Filter layer toggles
      if (finalStatus === 'licensed' && !showLicensedMarkers) return false;
      if (finalStatus === 'unlicensed' && !showUnlicensedMarkers) return false;
      if (finalStatus === 'ngo' && !showNgoMarkers) return false;
      if (finalStatus === 'expiring' && !showExpiringMarkers) return false;
      if (finalStatus === 'pending' && !showPendingMarkers) return false;

      const matchStatus = selectedStatus === 'all' || finalStatus === selectedStatus;
      const bWardNum = b.wardNumber.replace(/[^0-9]/g, '');
      const sWardNum = selectedWard.replace(/[^0-9]/g, '');
      const matchWard = isWardMember 
        ? bWardNum === assignedWard 
        : (selectedWard === 'all' || bWardNum === sWardNum || b.wardNumber === selectedWard);
      const matchCategory = selectedCategory === 'all' || b.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchInspection = selectedInspectionStatus === 'all' || 
        (selectedInspectionStatus === 'pending' && b.status === 'pending') || 
        (selectedInspectionStatus === 'completed' && b.status !== 'pending');

      return matchSearch && matchStatus && matchWard && matchCategory && matchInspection;
    });

    // Plot Business Markers
    filteredBuildings.forEach((building, i) => {
      let lat = building.coordinates?.lat;
      let lng = building.coordinates?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        const baseCenter = getPanchayathCenterCoordinates(activePanchayatCode);
        const centerLat = Array.isArray(baseCenter) ? baseCenter[0] : 11.4420;
        const centerLng = Array.isArray(baseCenter) ? baseCenter[1] : 75.8320;
        const wardNum = parseInt(building.wardNumber.replace(/[^0-9]/g, '') || '12', 10);
        lat = centerLat + ((wardNum % 10) * 0.0015) + (i * 0.0003);
        lng = centerLng + ((wardNum % 10) * 0.0015) + (i * 0.0003);
      }

      // BUG 2 FIX — Boundary Sanity Check:
      // If boundaryGeoJSON is loaded and point falls outside the real Panchayat boundary polygon,
      // DO NOT plot it as a map pin outside the boundary line.
      if (boundaryGeoJSON && boundaryGeoJSON.features && boundaryGeoJSON.features.length > 0) {
        const isInside = isPointInsideGeoJSON(lat, lng, boundaryGeoJSON);
        if (!isInside) {
          return;
        }
      }

      const bldgLic = licenses.find(l => l.buildingId === building.id);
      
      let finalStatus: string = building.status;
      if (building.status === 'licensed' && bldgLic && bldgLic.status === 'expired') {
        finalStatus = 'expiring';
      }

      // Color Coding System matching production GIS specs
      let color = '#64748B'; 
      if (finalStatus === 'licensed') color = '#15803D'; // Green (Licensed)
      else if (finalStatus === 'unlicensed') color = '#E11D48'; // Red (Unlicensed)
      else if (finalStatus === 'ngo') color = '#8B5CF6'; // Purple (NGO)
      else if (finalStatus === 'expiring') color = '#C2410C'; // Orange (Expiring)
      else if (finalStatus === 'pending') color = '#F59E0B'; // Yellow (Pending Inspection)
      else if (finalStatus === 'govt') color = '#2563EB'; // Blue (Government)

      const isSelected = activeBuilding?.id === building.id;
      const needsPulse = finalStatus === 'unlicensed' || finalStatus === 'expiring';
      const pulseColor = finalStatus === 'unlicensed' ? 'bg-red-500' : 'bg-orange-500';

      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center" style="width: 24px; height: 24px;">
            ${isSelected ? `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-60"></span>` : ''}
            ${isSelected ? `<div style="position: absolute; border: 2.5px solid #2563EB; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 0 8px #2563EB; z-index: 5;"></div>` : ''}
            ${needsPulse ? `<span class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${pulseColor} opacity-50"></span>` : ''}
            <div style="background-color: ${color}; width: 11px; height: 11px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4); z-index: 10;"></div>
          </div>
        `,
        className: 'custom-building-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Click opens Business Drawer
      marker.on('click', () => {
        setActiveBuilding(building);
        setSelectedWard(building.wardNumber);
        setActiveWardObj(null); 
        setShowActivityDrawer(false); 
        mapRef.current?.setView([lat, lng], 16);
      });

      // Double Click zooms locality
      marker.on('dblclick', () => {
        mapRef.current?.setView([lat, lng], 18);
      });

      // Hover Tooltip
      let statusBadge = '';
      if (finalStatus === 'licensed') statusBadge = '<span style="background:#E6F7F0;color:#15803D;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">LICENSED</span>';
      else if (finalStatus === 'unlicensed') statusBadge = '<span style="background:#FEE2E2;color:#E11D48;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">UNLICENSED</span>';
      else if (finalStatus === 'expiring') statusBadge = '<span style="background:#FFEFEB;color:#C2410C;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">EXPIRING</span>';
      else if (finalStatus === 'pending') statusBadge = '<span style="background:#FEF3C7;color:#D97706;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">PENDING SURVEY</span>';
      else if (finalStatus === 'ngo') statusBadge = '<span style="background:#F3E8FF;color:#8B5CF6;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">NGO EXEMPT</span>';
      else if (finalStatus === 'govt') statusBadge = '<span style="background:#DBEAFE;color:#2563EB;padding:2px 5px;border-radius:4px;font-weight:bold;font-size:9px;">GOVT EXEMPT</span>';

      const geocodeBadge = building.isGeocodedApproximate 
        ? `<div style="margin-top:4px;background:#FEF2F2;color:#991B1B;border:1px solid #FCA5A5;padding:2px 5px;border-radius:4px;font-size:8px;font-weight:bold;">📍 Approximate location — unverified</div>`
        : `<div style="margin-top:4px;background:#F0FDF4;color:#166534;border:1px solid #86EFAC;padding:2px 5px;border-radius:4px;font-size:8px;font-weight:bold;">✓ Verified Onsite GPS</div>`;

      marker.bindTooltip(`
        <div style="font-family:sans-serif;padding:6px;width:190px;white-space:normal;line-height:1.4;">
          <strong style="color:#0f172a;font-size:12px;display:block;margin-bottom:3px;">${building.businessName}</strong>
          <span style="font-size:10px;color:#475569;display:block;margin-bottom:3px;">Owner: ${building.ownerName}</span>
          ${building.structureNumber ? `<span style="font-size:9px;color:#64748b;display:block;margin-bottom:3px;">Door: ${building.structureNumber}</span>` : ''}
          <div style="display:flex;justify-space-between;align-items:center;border-top:1px solid #e2e8f0;padding-top:4px;margin-top:4px;">
            ${statusBadge}
            <span style="font-family:monospace;font-size:9px;color:#94a3b8;">${building.id}</span>
          </div>
          ${geocodeBadge}
        </div>
      `, { direction: 'top', offset: [0, -8] });

      markersGroupRef.current?.addLayer(marker);
    });

    // Auto-fit map camera bounds to display imported building pins
    if (filteredBuildings.length > 0) {
      const validCoords = filteredBuildings
        .map(b => {
          let l1 = b.coordinates?.lat;
          let l2 = b.coordinates?.lng;
          if (typeof l1 === 'number' && typeof l2 === 'number' && !isNaN(l1) && !isNaN(l2)) {
            return [l1, l2] as [number, number];
          }
          return null;
        })
        .filter(Boolean) as [number, number][];

      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      }
    }
  }, [
    buildings, 
    licenses, 
    searchQuery, 
    selectedStatus, 
    selectedWard, 
    selectedCategory, 
    selectedInspectionStatus, 
    isWardMember, 
    assignedWard, 
    activeBuilding,
    showLicensedMarkers,
    showUnlicensedMarkers,
    showNgoMarkers,
    showExpiringMarkers,
    showPendingMarkers
  ]);

  // Dynamic range circle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeCircleRef.current) {
      map.removeLayer(activeCircleRef.current);
      activeCircleRef.current = null;
    }

    if (activeBuilding) {
      const { lat, lng } = activeBuilding.coordinates;
      let color = '#2563EB';
      
      const bldgLic = licenses.find(l => l.buildingId === activeBuilding.id);
      let finalStatus: string = activeBuilding.status;
      if (activeBuilding.status === 'licensed' && bldgLic && bldgLic.status === 'expired') {
        finalStatus = 'expiring';
      }

      if (finalStatus === 'licensed') color = '#15803D';
      else if (finalStatus === 'unlicensed') color = '#E11D48';
      else if (finalStatus === 'expiring') color = '#C2410C';
      else if (finalStatus === 'pending') color = '#F59E0B';
      else if (finalStatus === 'ngo') color = '#8B5CF6';

      const circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.05,
        weight: 1.5,
        dashArray: '5, 5',
        radius: 100 
      }).addTo(map);
      
      activeCircleRef.current = circle;
    }
  }, [activeBuilding, licenses]);

  // Ruler Tool
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.off('click');

    if (!isMeasuring) {
      if (measureLine) {
        map.removeLayer(measureLine);
        setMeasureLine(null);
      }
      setMeasurePoints([]);
      setMeasuredDistance(null);
      return;
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      setMeasurePoints((prevPoints) => {
        const newPoints = [...prevPoints, e.latlng];
        
        if (measureLine) {
          measureLine.setLatLngs(newPoints);
        } else {
          const line = L.polyline(newPoints, { color: '#E11D48', weight: 2.5, dashArray: '5, 5' }).addTo(map);
          setMeasureLine(line);
        }

        let totalDist = 0;
        for (let i = 1; i < newPoints.length; i++) {
          totalDist += newPoints[i-1].distanceTo(newPoints[i]);
        }
        setMeasuredDistance(totalDist);

        return newPoints;
      });
    });

    return () => {
      map.off('click');
    };
  }, [isMeasuring, measureLine]);

  // Autocomplete Search Select
  const handleSelectSearch = (b: BuildingRecord) => {
    setActiveBuilding(b);
    setSelectedWard(b.wardNumber);
    setActiveWardObj(null);
    setShowActivityDrawer(false);

    if (mapRef.current) {
      mapRef.current.setView([b.coordinates.lat, b.coordinates.lng], 17);
    }
    setSearchQuery('');
  };



  const handleSimulateSurveySync = async (b: BuildingRecord) => {
    setSurveySyncStatus(`Synchronizing VEO survey report for ${b.businessName}...`);
    setTimeout(async () => {
      const updated = buildings.map(item => {
        if (item.id === b.id) {
          return { ...item, status: 'licensed' as const };
        }
        return item;
      });
      setBuildings(updated);
      await dbService.addAuditLog('SURVEY_SYNC', `Inspection uploaded. Unified building status for ${b.businessName} updated to licensed.`);
      setSurveySyncStatus(`Survey synced. ${b.businessName} status updated to Licensed.`);
      setActiveBuilding({ ...b, status: 'licensed' });
    }, 1000);
  };

  const handlePrintMap = () => {
    window.print();
  };

  const handleExportMap = () => {
    const geojsonData = {
      type: "FeatureCollection",
      features: buildings.map(b => ({
        type: "Feature",
        properties: {
          id: b.id,
          businessName: b.businessName,
          category: b.category,
          status: b.status,
          ownerName: b.ownerName
        },
        geometry: {
          type: "Point",
          coordinates: [b.coordinates.lng, b.coordinates.lat]
        }
      }))
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${panchayatName.toLowerCase().replace(/\s+/g, '_')}_gis_export.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    dbService.addAuditLog('EXPORT_GIS', `${panchayatName} Secretary exported active GIS enterprise layer to GeoJSON file.`);
    alert('GeoJSON exported successfully.');
  };

  const getExtractedPhone = (ownerText: string) => {
    const clean = ownerText.replace(/\s+/g, '');
    const match = clean.match(/\d{10}/);
    return match ? match[0] : null;
  };
  const extractedPhone = activeBuilding ? getExtractedPhone(activeBuilding.ownerName) : null;

  const isAnyDrawerOpen = activeBuilding !== null || activeWardObj !== null || showActivityDrawer;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] select-none font-sans relative text-slate-800 bg-slate-50">
      
      {/* 90% VIEWPORT: GIS MAP AREA */}
      <div className="flex-1 w-full h-full relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
        
        {/* Leaflet Map Hook */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* -------------------- COMPACT FLOATING TOP NAVIGATION BAR (Accessibility Compliant) -------------------- */}
        <div className="absolute top-4 left-4 right-4 z-20 h-14 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-2xl px-4 flex items-center justify-between">
          
          {/* Left section: Autocomplete search */}
          <div className="flex items-center space-x-3 w-80 relative">
            <div className="relative w-full">
              <input
                type="text"
                aria-label={t('common.search')}
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-350 rounded-xl pl-8 pr-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#15803D]"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
            </div>
            {searchQuery && (
              <div className="absolute top-11 left-0 right-0 bg-white border border-slate-250 rounded-xl shadow-xl z-35 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {buildings
                  .filter(b => b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleSelectSearch(b)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition text-slate-800 flex justify-between font-semibold"
                    >
                      <span className="truncate">{b.businessName}</span>
                      <span className="font-mono text-slate-400 text-xs shrink-0">{b.id}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Right section: Control Popover Triggers, K-SMART Portal & Activity Bell */}
          <div className="flex items-center space-x-3">
            
            {/* K-SMART Official Ward Map Link Button */}


            {/* Filters Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFiltersPopover(!showFiltersPopover);
                  setShowLayersPopover(false);
                  setShowLegendPopover(false);
                }}
                className={`px-3 py-2 rounded-xl border text-sm font-bold uppercase transition flex items-center space-x-1.5 focus:ring-2 focus:ring-[#15803D] focus:outline-none ${
                  showFiltersPopover ? 'bg-slate-150 border-slate-400 text-slate-900' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <Filter size={14} />
                <span>Filters</span>
              </button>
              
              {showFiltersPopover && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-72 z-30 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Map Filters</span>
                    <button onClick={() => {
                      setSelectedWard('all');
                      setSelectedStatus('all');
                      setSelectedCategory('all');
                      setSelectedInspectionStatus('all');
                    }} className="text-[#15803D] text-xs font-bold uppercase hover:underline">Reset</button>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ward boundary</label>
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        disabled={isWardMember}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 bg-slate-50 font-semibold focus:ring-2 focus:ring-[#15803D]"
                      >
                        <option value="all">All Wards</option>
                        {wards.map((w: WardRecord) => (
                          <option key={w.id} value={w.id}>Ward {w.id} - {w.name.split(' - ')[1] || w.name}</option>
                        )) }
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 bg-slate-50 font-semibold focus:ring-2 focus:ring-[#15803D]"
                      >
                        <option value="all">All Licenses</option>
                        <option value="licensed">Licensed</option>
                        <option value="unlicensed">Unlicensed</option>
                        <option value="expiring">Expired/Expiring</option>
                        <option value="pending">Pending inspection</option>
                        <option value="ngo">NGO Exempt</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 bg-slate-50 font-semibold focus:ring-2 focus:ring-[#15803D]"
                      >
                        <option value="all">All Categories</option>
                        <option value="banking">Banking / Finance</option>
                        <option value="tourism">Tourism / Boating</option>
                        <option value="educational">Educational</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Layers Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLayersPopover(!showLayersPopover);
                  setShowFiltersPopover(false);
                  setShowLegendPopover(false);
                }}
                className={`px-3 py-2 rounded-xl border text-sm font-bold uppercase transition flex items-center space-x-1.5 focus:ring-2 focus:ring-[#15803D] focus:outline-none ${
                  showLayersPopover ? 'bg-slate-150 border-slate-400 text-slate-900' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <Layers size={14} />
                <span>Layers</span>
              </button>

              {showLayersPopover && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-80 z-30 space-y-4 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2 border-b pb-1">Base Layer</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setMapStyle('satellite')}
                        className={`flex-1 text-xs font-bold uppercase py-1.5 rounded-lg border text-center transition ${
                          mapStyle === 'satellite' ? 'bg-[#15803D] border-[#15803D] text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        Satellite View
                      </button>
                      <button
                        onClick={() => setMapStyle('road')}
                        className={`flex-1 text-xs font-bold uppercase py-1.5 rounded-lg border text-center transition ${
                          mapStyle === 'road' ? 'bg-[#15803D] border-[#15803D] text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        Vector Map
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <span className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Toggle GIS Map Elements</span>
                    
                    <div className="space-y-2.5 text-slate-700 font-semibold">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Ward Boundary Choropleth</span>
                        <input type="checkbox" checked={showBoundaries} onChange={(e) => setShowBoundaries(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Licensed Pins (Green)</span>
                        <input type="checkbox" checked={showLicensedMarkers} onChange={(e) => setShowLicensedMarkers(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Unlicensed Pins (Red)</span>
                        <input type="checkbox" checked={showUnlicensedMarkers} onChange={(e) => setShowUnlicensedMarkers(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>NGO Exempt Pins (Purple)</span>
                        <input type="checkbox" checked={showNgoMarkers} onChange={(e) => setShowNgoMarkers(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Expired/Expiring Pins (Orange)</span>
                        <input type="checkbox" checked={showExpiringMarkers} onChange={(e) => setShowExpiringMarkers(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span>Pending Inspections (Blue)</span>
                        <input type="checkbox" checked={showPendingMarkers} onChange={(e) => setShowPendingMarkers(e.target.checked)} className="accent-[#15803D] h-4 w-4 rounded" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <span className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Analytics Density Overlays</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10.5px] font-bold text-center">
                      <button
                        onClick={() => setShowUnlicensedHeat(!showUnlicensedHeat)}
                        className={`py-1.5 rounded border transition ${showUnlicensedHeat ? 'bg-red-55 border-red-400 text-red-800 ring-1 ring-red-400' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'}`}
                      >
                        Unlicensed Density
                      </button>
                      <button
                        onClick={() => setShowInspectionHeat(!showInspectionHeat)}
                        className={`py-1.5 rounded border transition ${showInspectionHeat ? 'bg-blue-55 border-blue-400 text-blue-800 ring-1 ring-blue-400' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'}`}
                      >
                        Inspection Coverage
                      </button>
                      <button
                        onClick={() => setShowBusinessDensity(!showBusinessDensity)}
                        className={`py-1.5 rounded border transition ${showBusinessDensity ? 'bg-emerald-55 border-emerald-400 text-emerald-800 ring-1 ring-emerald-400' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'}`}
                      >
                        Business Density
                      </button>
                      <button
                        onClick={() => setShowRenewalHeat(!showRenewalHeat)}
                        className={`py-1.5 rounded border transition ${showRenewalHeat ? 'bg-orange-55 border-orange-400 text-orange-850 ring-1 ring-orange-405' : 'border-slate-300 text-slate-700 hover:bg-slate-50 bg-white'}`}
                      >
                        Renewal Hotspots
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Legend Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLegendPopover(!showLegendPopover);
                  setShowFiltersPopover(false);
                  setShowLayersPopover(false);
                }}
                className={`px-3 py-2 rounded-xl border text-sm font-bold uppercase transition flex items-center space-x-1.5 focus:ring-2 focus:ring-[#15803D] focus:outline-none ${
                  showLegendPopover ? 'bg-slate-150 border-slate-400 text-slate-900' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <BookOpen size={14} />
                <span>Legend</span>
              </button>

              {showLegendPopover && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 w-64 z-30 space-y-3.5 text-sm font-semibold text-slate-700">
                  <span className="block text-xs font-bold text-slate-450 uppercase tracking-wider border-b pb-2 mb-2">GIS MAP LEGEND</span>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#15803D] inline-block"></span>
                      <span>Licensed Business</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#E11D48] inline-block relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                      </span>
                      <span>Unlicensed Premise</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#C2410C] inline-block relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-40"></span>
                      </span>
                      <span>Expired / Expiring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#F59E0B] inline-block"></span>
                      <span>Pending Inspection</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#2563EB] inline-block"></span>
                      <span>Government Building</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-4 h-4 rounded-full border-2 border-white shadow bg-[#8B5CF6] inline-block"></span>
                      <span>NGO / Charitable Exempt</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Activity Alerts Drawer Trigger */}
            <button
              onClick={() => {
                setShowActivityDrawer(!showActivityDrawer);
                setActiveBuilding(null);
                setActiveWardObj(null);
              }}
              aria-label="View notifications and alerts drawer"
              className={`p-2 rounded-xl border transition relative focus:ring-2 focus:ring-[#15803D] focus:outline-none ${
                showActivityDrawer ? 'bg-slate-155 border-slate-400 text-slate-900' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile badge avatar placeholder */}
            <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer select-none">
              MJ
            </div>

          </div>

        </div>

        {/* -------------------- FLOATING MAP CONTROLS (Locate, Zoom, Fullscreen, Measure, Print, Export) -------------------- */}
        <div className="absolute top-20 right-4 z-20 bg-white border border-slate-200 shadow-md rounded-2xl p-1.5 flex flex-col space-y-1">
          
          <button
            onClick={() => {
              if (mapRef.current) mapRef.current.setView([11.57547, 75.81649], 13);
              alert('Panchayat centered.');
            }}
            title="Locate Panchayat Center"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-[#15803D] focus:outline-none focus:bg-slate-100"
          >
            <Compass size={16} />
          </button>

          <button
            onClick={() => {
              if (mapRef.current) mapRef.current.zoomIn();
            }}
            title="Zoom In"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-700 font-extrabold text-sm focus:outline-none focus:bg-slate-100"
          >
            +
          </button>

          <button
            onClick={() => {
              if (mapRef.current) mapRef.current.zoomOut();
            }}
            title="Zoom Out"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-700 font-extrabold text-sm focus:outline-none focus:bg-slate-100"
          >
            −
          </button>

          <button
            onClick={() => setIsMeasuring(!isMeasuring)}
            title="Measure Tool"
            className={`p-2 rounded-xl transition focus:outline-none ${isMeasuring ? 'bg-red-50 text-red-800' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            <Ruler size={16} />
          </button>

          <button
            onClick={handlePrintMap}
            title="Print Map View"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-700 focus:outline-none focus:bg-slate-100"
          >
            <Printer size={16} />
          </button>

          <button
            onClick={handleExportMap}
            title="Export GIS data file"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-700 focus:outline-none focus:bg-slate-100"
          >
            <Download size={16} />
          </button>

          <button
            onClick={() => alert('Fullscreen workspace mode active.')}
            title="Fullscreen GIS Workspace"
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-700 focus:outline-none focus:bg-slate-100"
          >
            <Maximize2 size={16} />
          </button>

        </div>

        {/* Measurement Distance Display */}
        {measuredDistance !== null && (
          <div className="absolute bottom-4 right-4 z-20 bg-red-50 border border-red-200 shadow-md rounded-2xl px-3 py-2 text-sm font-mono text-red-950 font-bold">
            Distance: {measuredDistance < 1000 ? `${measuredDistance.toFixed(1)} m` : `${(measuredDistance / 1000).toFixed(3)} km`}
          </div>
        )}

        {/* Pin placement active mode banner */}
        {placingBuildingId && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-950 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center space-x-3 text-xs font-bold animate-bounce">
            <MapPin className="text-emerald-400 animate-pulse" size={18} />
            <span>Click anywhere inside Ward 12 on the map to set exact doorstep location</span>
            <button 
              onClick={() => setPlacingBuildingId(null)}
              className="bg-white/20 hover:bg-white/30 text-white text-[10px] px-2.5 py-1 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Unplaced buildings / out-of-boundary notification panel */}
        {unplacedBuildings.length > 0 && !isAnyDrawerOpen && (
          <div className="absolute bottom-4 right-4 z-20 bg-amber-50 border border-amber-300 shadow-xl rounded-2xl p-3.5 w-80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-extrabold text-amber-900 text-xs">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>Location Pinning Required ({unplacedBuildings.length})</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-800 leading-snug">
              Geocoded location fell outside Panchayat boundary polygon. Manual placement required before pin is displayed on map.
            </p>
            <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto">
              {unplacedBuildings.map(b => (
                <div key={b.id} className="bg-white border border-amber-200 rounded-xl p-2 flex items-center justify-between text-xs shadow-sm">
                  <div>
                    <span className="font-bold text-slate-800 block truncate w-36">{b.businessName}</span>
                    <span className="text-[10px] text-slate-500">Ward {b.wardNumber} • {b.id}</span>
                  </div>
                  <button
                    onClick={() => setPlacingBuildingId(b.id)}
                    className="bg-[#0F6E4F] hover:bg-[#0B5A3E] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition shadow-sm shrink-0 flex items-center space-x-1"
                  >
                    <MapPin size={12} />
                    <span>Pin Location</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- FLOATING BOTTOM INFORMATION CARD (Display only when nothing is selected) -------------------- */}
        {!isAnyDrawerOpen && (
          <div className="absolute bottom-4 left-4 z-20 bg-white border border-slate-250 shadow-md rounded-2xl p-4 w-80 text-sm text-slate-800">
            <div className="flex justify-between items-start mb-2.5 border-b border-slate-150 pb-2">
              <div>
                <span className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider block">Grama Panchayat Boundary</span>
                <strong className="text-slate-900 text-base block font-bold mt-0.5">{panchayatName}</strong>
              </div>
            </div>

            {boundaryUnavailable && (
              <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs p-2.5 rounded-xl flex items-start space-x-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>Boundary polygon data not yet available for this Grama Panchayat in open spatial datasets.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-3 gap-y-3 pt-1 font-semibold text-slate-700">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Compliance</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {buildings.length > 0 
                    ? (100 * buildings.filter(b => b.status === 'licensed').length / buildings.length).toFixed(1) 
                    : '0.0'}%
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Enterprises</span>
                <span className="font-extrabold text-slate-900 text-sm">{buildings.length} Active</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase font-bold">Inspections Due</span>
                <span className="font-extrabold text-amber-700 text-sm">
                  {buildings.filter(b => b.status === 'pending').length} Shops
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Expiring in 30 Days</span>
                <span className="font-extrabold text-orange-700 text-sm">
                  {licenses.filter(l => l.status === 'expired').length} Licenses
                </span>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- DYNAMIC SLIDE-OUT DRAWER OVERLAYS (420px width) -------------------- */}

        {/* 1. SELECTED ENTERPRISE DRAWER */}
        <div className={`absolute right-0 top-0 bottom-0 z-30 w-[420px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          activeBuilding ? 'translate-x-0' : 'translate-x-full'
        } p-6 overflow-y-auto flex flex-col justify-between`}>
          
          {activeBuilding && (
            <div className="space-y-6 text-sm text-slate-800 flex-grow flex flex-col min-h-0">
              
              {/* Header */}
              <div className="border-b pb-4 flex justify-between items-start shrink-0">
                <div>
                  <span className="font-mono text-[10px] font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">Enterprise Registry File</span>
                  <h3 className="font-bold text-slate-900 text-lg mt-2 leading-snug">{activeBuilding.businessName}</h3>
                  <span className="text-xs text-slate-500 mt-1 block font-mono">K-SMART Ref: {activeBuilding.id}</span>
                </div>
                <button 
                  onClick={() => setActiveBuilding(null)}
                  className="text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg p-1.5 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Section */}
              <div className="space-y-2 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Compliance Status</span>
                
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900">
                  <span className="capitalize">{activeBuilding.status === 'pending' ? 'Pending Inspection' : activeBuilding.status}</span>
                  
                  <span className={`w-4 h-4 rounded-full border-2 border-white shadow inline-block ${
                    activeBuilding.status === 'licensed' ? 'bg-[#15803D]' :
                    activeBuilding.status === 'unlicensed' ? 'bg-[#E11D48]' :
                    activeBuilding.status === 'pending' ? 'bg-[#F59E0B]' :
                    activeBuilding.status === 'ngo' ? 'bg-[#8B5CF6]' : 'bg-[#2563EB]'
                  }`}></span>
                </div>
              </div>

              {/* Attributes list */}
              <div className="space-y-2 flex-grow overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registry parameters</span>
                
                <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-2xl space-y-3.5 font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs uppercase font-bold">Proprietor Name</span>
                    <span className="text-slate-900 truncate max-w-44 text-right">{activeBuilding.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs uppercase font-bold">Grama Ward</span>
                    <span className="text-slate-900 font-bold">Ward {activeBuilding.wardNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs uppercase font-bold">Category</span>
                    <span className="text-slate-900 truncate max-w-44 text-right">{activeBuilding.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs uppercase font-bold">GPS Coordinates</span>
                    <span className="text-slate-600 font-mono text-xs">{activeBuilding.coordinates.lat.toFixed(5)}, {activeBuilding.coordinates.lng.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 mt-2 border-slate-200">
                    <span className="text-[#15803D] text-xs uppercase font-bold">Active License ID</span>
                    <span className="font-mono text-slate-900 font-bold">{activeBuilding.licenseId || 'UNLICENSED'}</span>
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://ksmart.lsgkerala.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0F6E4F] border border-emerald-200 rounded-xl py-2 px-3 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                    >
                      <span>Open K-SMART Official ERP Record</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Inspection history */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inspections history log</span>
                  <div className="space-y-2 text-[11.5px]">
                    {activeBuilding.history?.map((h, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-lg flex justify-between items-start border border-slate-100">
                        <div>
                          <strong className="text-slate-800 font-bold block">{h.action}</strong>
                          <span className="text-slate-500 text-xs">{h.date} | {h.user}</span>
                        </div>
                        <span className="text-slate-600 italic max-w-44 truncate text-right">"{h.remarks}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-3 border-t border-slate-200 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Field deployment actions</span>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase font-semibold">WhatsApp Recipient</label>
                  <select
                    value={whatsappRecipient}
                    onChange={(e) => setWhatsappRecipient(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2 text-xs bg-slate-50 font-bold text-slate-700 outline-none focus:border-[#0F6E4F] transition"
                  >
                    <option value="7025643678">Sreya (+91 70256 43678)</option>
                    <option value="8281466322">Avanthika (+91 82814 66322)</option>
                    {extractedPhone && extractedPhone !== '7025643678' && extractedPhone !== '8281466322' && (
                      <option value={extractedPhone}>
                        Extracted: +91 {extractedPhone.slice(0, 5)} {extractedPhone.slice(5)}
                      </option>
                    )}
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={`https://wa.me/91${whatsappRecipient}?text=${encodeURIComponent(`Notice from ${panchayatName}: Proprietor of ${activeBuilding.businessName}, your trade establishment has been flagged operating without a valid license. Please apply for immediate renewal on K-SMART portal to avoid penal action.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      dbService.addWhatsAppLog({
                        businessName: activeBuilding.businessName,
                        recipientName: whatsappRecipient === '7025643678' ? 'Sreya' : 'Avanthika',
                        contactNumber: whatsappRecipient,
                        channel: 'WhatsApp',
                        messageText: `Notice from ${panchayatName}: Proprietor of ${activeBuilding.businessName}, your trade establishment has been flagged operating without a valid license. Please apply for immediate renewal on K-SMART portal to avoid penal action.`,
                        status: 'sent'
                      });
                      setWhatsappStatus(`WhatsApp reminder alert dispatched to ${whatsappRecipient === '7025643678' ? 'Sreya' : 'Avanthika'} (+91 ${whatsappRecipient})`);
                      dbService.addAuditLog('WHATSAPP_ALERT', `WhatsApp Bot dispatched unlicensed warning notice to ${whatsappRecipient === '7025643678' ? 'Sreya' : 'Avanthika'} (+91 ${whatsappRecipient}) for ${activeBuilding.businessName}.`);
                    }}
                    className="flex-1 bg-[#15803D] hover:bg-[#0e5628] text-white font-bold uppercase py-2.5 rounded-xl transition text-[11px] flex items-center justify-center space-x-1 shadow-sm text-center"
                  >
                    <RefreshCw size={12} />
                    <span>WhatsApp alert notice</span>
                  </a>

                  <button
                    onClick={() => handleSimulateSurveySync(activeBuilding)}
                    disabled={activeBuilding.status !== 'pending'}
                    className="flex-1 bg-[#0F6E4F] hover:bg-[#084833] text-white font-bold uppercase py-2.5 rounded-xl transition text-[11px] flex items-center justify-center space-x-1 shadow-sm disabled:opacity-40"
                  >
                    <Check size={12} />
                    <span>Sync field survey</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => alert(`Redirecting to details drawer for ${activeBuilding.id}`)}
                    className="flex-1 border border-slate-350 text-slate-700 hover:bg-slate-50 font-bold uppercase py-2 rounded-xl text-[11px] focus:ring-2 focus:ring-[#15803D]"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => alert(`Starting VEO navigation to coordinates`)}
                    className="flex-1 border border-slate-350 text-slate-700 hover:bg-slate-50 font-bold uppercase py-2 rounded-xl text-[11px] focus:ring-2 focus:ring-[#15803D]"
                  >
                    Navigate Route
                  </button>
                </div>
              </div>

              {/* Simulations output log */}
              {(whatsappStatus || surveySyncStatus) && (
                <div className="bg-slate-50 p-3 border border-slate-200 rounded-xl text-xs leading-relaxed italic text-emerald-800 font-mono mt-2 shrink-0">
                  {surveySyncStatus && <div>{surveySyncStatus}</div>}
                  {whatsappStatus && <div className="mt-1 text-slate-600">{whatsappStatus}</div>}
                </div>
              )}

            </div>
          )}

        </div>

        {/* 2. SELECTED WARD DRAWER */}
        <div className={`absolute right-0 top-0 bottom-0 z-30 w-[420px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          activeWardObj ? 'translate-x-0' : 'translate-x-full'
        } p-6 overflow-y-auto flex flex-col justify-between`}>
          
          {activeWardObj && (
            <div className="space-y-6 text-sm text-slate-800 flex-grow flex flex-col min-h-0">
              
              {/* Header */}
              <div className="border-b pb-4 flex justify-between items-start shrink-0">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wide">Panchayat Ward File</span>
                  <h3 className="font-bold text-slate-900 text-lg mt-2 leading-snug">{activeWardObj.name}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">Assigned Inspector VEO: {activeWardObj.assignedOfficer}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedWard('all');
                    setActiveWardObj(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg p-1.5 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Compliance Rating Bar */}
              <div className="space-y-2 shrink-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ward Compliance Index</span>
                  <span className="font-mono font-extrabold text-[#15803D]">{activeWardObj.compliancePercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      activeWardObj.compliancePercentage >= 90 ? 'bg-emerald-600' :
                      activeWardObj.compliancePercentage >= 80 ? 'bg-green-500' :
                      activeWardObj.compliancePercentage >= 70 ? 'bg-yellow-500' :
                      activeWardObj.compliancePercentage >= 60 ? 'bg-orange-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${activeWardObj.compliancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Statistics lists */}
              <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ward census overview</span>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Licensed Shops</span>
                    <span className="text-xl font-extrabold text-slate-900">{activeWardObj.licensedBuildings}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Unlicensed Alert</span>
                    <span className="text-xl font-extrabold text-red-650">{activeWardObj.unlicensedBuildings}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center col-span-2">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Inspections Needed</span>
                    <span className="text-xs font-bold text-amber-700 mt-1 block">{activeWardObj.pendingBuildings} Enterprises pending survey</span>
                  </div>
                </div>

                {/* List of matching buildings in ward */}
                <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Enterprises in this ward</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
                    {buildings
                      .filter(b => b.wardNumber === activeWardObj.id)
                      .map(b => (
                        <div key={b.id} className="flex justify-between items-center text-xs p-2 hover:bg-white rounded-lg transition font-semibold text-slate-700 border border-transparent">
                          <span className="truncate pr-2">{b.businessName}</span>
                          <span className={`px-1.5 py-0.25 rounded text-[9px] font-bold uppercase shrink-0 ${
                            b.status === 'licensed' ? 'bg-green-50 text-status-licensed' :
                            b.status === 'unlicensed' ? 'bg-red-50 text-status-unlicensed' :
                            'bg-amber-50 text-amber-800'
                          }`}>{b.status}</span>
                        </div>
                      ))}
                  </div>
                </div>

              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-3 border-t border-slate-200 shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Enforcement operations</span>
                
                <button
                  onClick={() => alert(`Inspection planner routed for Ward ${activeWardObj.id}. Dispatched notification tasks to ${activeWardObj.assignedOfficer}.`)}
                  className="w-full bg-[#15803D] hover:bg-[#0e5628] text-white font-bold uppercase py-2.5 rounded-xl transition text-[11px]"
                >
                  Plan VEO Field Inspection Route
                </button>

                <button
                  onClick={() => alert(`Generated batch warnings for ${activeWardObj.unlicensedBuildings} unlicensed premises in Ward ${activeWardObj.id}.`)}
                  className="w-full border border-slate-350 text-slate-750 hover:bg-slate-50 font-bold uppercase py-2.5 rounded-xl transition text-[11px]"
                >
                  Generate Batch Notices
                </button>
              </div>

            </div>
          )}

        </div>

        {/* 3. HIGH PRIORITY ALERTS / ACTIVITY DRAWER */}
        <div className={`absolute right-0 top-0 bottom-0 z-30 w-[420px] bg-white border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          showActivityDrawer ? 'translate-x-0' : 'translate-x-full'
        } p-6 overflow-y-auto flex flex-col justify-between`}>
          
          <div className="space-y-6 text-sm text-slate-800 flex-grow flex flex-col min-h-0">
            
            {/* Header */}
            <div className="border-b pb-4 flex justify-between items-start shrink-0">
              <div>
                <span className="font-mono text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase tracking-wide">Panchayat Spatial Logs</span>
                <h3 className="font-bold text-slate-900 text-lg mt-2">Active Notifications & Alerts</h3>
              </div>
              <button 
                onClick={() => setShowActivityDrawer(false)}
                className="text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg p-1.5 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* High priority warnings list */}
            <div className="space-y-5 flex-grow overflow-y-auto pr-1">
              
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">High Priority Spatial Alerts</span>
                
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 space-y-2 text-sm leading-normal">
                  <div className="flex items-center space-x-1.5 text-red-700 font-bold text-xs uppercase tracking-wide">
                    <AlertTriangle size={13} />
                    <span>Compliance Action Warnings</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-slate-700 font-medium">
                    <li>Ward 11 (Peruvannamuzhi): 8 Unlicensed operating stores detected. Compliance rate: 57%.</li>
                    <li>Ward 5 (Ilamkad): 6 unlicensed operating stores detected. Compliance rate: 52%.</li>
                    <li>Expired licenses count: 2.</li>
                  </ul>
                </div>
              </div>

              {/* Sync entries */}
              <div className="space-y-2 border-t pt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">K-SMART Direct Sync Audits</span>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 text-slate-700 font-semibold leading-normal">
                  <div className="flex justify-between border-b pb-1.5 font-bold">
                    <span>ACTION</span>
                    <span>TIMESTAMP</span>
                  </div>
                  {syncHistory.length === 0 ? (
                    <div className="text-slate-400 italic text-center py-2 text-[10px]">No imports processed yet.</div>
                  ) : (
                    syncHistory.slice(0, 3).map(h => (
                      <div key={h.id} className="flex justify-between items-start">
                        <span>Imported {h.fileName} ({h.importedCount} rows)</span>
                        <span className="font-mono text-xs text-slate-450 shrink-0">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bot deliveries status */}
              <div className="space-y-2 border-t pt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">WhatsApp Bot Alerts Delivery</span>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 text-slate-700 font-semibold">
                  {whatsappLogs.length === 0 ? (
                    <div className="text-slate-400 italic text-center py-2 text-[10px]">No message logs recorded.</div>
                  ) : (
                    whatsappLogs.slice(0, 3).map(w => (
                      <div key={w.id} className="flex justify-between">
                        <span className="truncate pr-2">{w.businessName}</span>
                        <span className={`text-[10px] font-bold uppercase shrink-0 ${w.status === 'sent' ? 'text-emerald-700' : 'text-slate-500'}`}>{w.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 shrink-0">
              <button
                onClick={() => {
                  alert('Forcing live database sync request to K-SMART API gateways.');
                  dbService.addAuditLog('KSMART_SYNC', 'Manual API gateway synchronization request triggered by Grama Panchayat Secretary.');
                }}
                className="w-full bg-[#15803D] hover:bg-[#0e5628] text-white font-bold uppercase py-2.5 rounded-xl transition text-[11px]"
              >
                Force K-SMART Database Sync
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* -------------------- K-SMART OFFICIAL WARD DELIMITATION MODAL -------------------- */}
      {showKsmartModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-[#15803D] p-2 rounded-xl text-white">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-2">
                    <span>K-SMART Official Ward Delimitation Map</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase">Official Portal</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {panchayatName} | Direct URL: <span className="font-mono text-emerald-400">{getKsmartWardMapUrl()}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={getKsmartWardMapUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border border-white/20"
                >
                  <ExternalLink size={14} />
                  <span>Open in New Tab</span>
                </a>
                <button
                  onClick={() => setShowKsmartModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Frame Container */}
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={getKsmartWardMapUrl()}
                title={`K-SMART Ward Delimitation Map - ${panchayatName}`}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600 font-medium shrink-0">
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Connected to Official Delimitation Commission Portal ({panchayatName})</span>
              </span>
              <button
                onClick={() => setShowKsmartModal(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-1.5 rounded-xl text-xs uppercase transition"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
