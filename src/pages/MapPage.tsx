import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import type { BuildingRecord, WardRecord } from '../types';
import { Link } from 'react-router-dom';
import { Search, MapPin, Ruler, Eye, X, Filter, ShieldAlert } from 'lucide-react';

export const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  
  const currentUser = authService.getCurrentUser();
  const assignedWard = currentUser?.ward || '1';
  const isWardMember = currentUser?.role === 'Ward Member';

  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [wards, setWards] = useState<WardRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>(isWardMember ? assignedWard : 'all');
  const [activeBuilding, setActiveBuilding] = useState<BuildingRecord | null>(null);
  const [activePanchayatCode] = useState<string>(
    localStorage.getItem('cp_active_panchayat_code') || '204902'
  );
  
  // Measurement state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [, setMeasurePoints] = useState<L.LatLng[]>([]);
  const [measureLine, setMeasureLine] = useState<L.Polyline | null>(null);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Load database state
  useEffect(() => {
    const unsubBuildings = dbService.subscribeToBuildings(setBuildings);
    const unsubWards = dbService.subscribeToWards(setWards);
    return () => {
      unsubBuildings();
      unsubWards();
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Chakkittapara center coordinates
    const map = L.map(mapContainerRef.current).setView([11.57547, 75.81649], 13);
    mapRef.current = map;

    // Premium base maps matching leaflet template themes
    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Community Map Contributors'
    });

    const cartoDbPositron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // Default to premium Satellite layer matching Figma onboarding Step 3!
    esriSatellite.addTo(map);

    // Dynamic layer toggling control
    const baseMaps = {
      "Satellite Imagery": esriSatellite,
      "Clean Light Map": cartoDbPositron
    };
    L.control.layers(baseMaps, undefined, { position: 'topright' }).addTo(map);

    // Initialize markers group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Load Ward Boundaries GeoJSON
    let isMounted = true;
    fetch('/data/chakkittapara_wards.geojson')
      .then(res => res.json())
      .then(geoJsonData => {
        if (!isMounted || !mapRef.current) return;
        const geoJsonLayer = L.geoJSON(geoJsonData, {
          filter: (feature) => {
            return !isWardMember || feature?.properties?.ward_number === assignedWard;
          },
          style: (feature) => {
            const wardNum = feature?.properties?.ward_number;
            const isSelected = selectedWard === wardNum;
            return {
              color: '#0F6E4F', // Unified clean brand green boundary line
              weight: isSelected ? 3 : 1.5,
              opacity: isSelected ? 1 : 0.4,
              fillColor: '#0F6E4F',
              fillOpacity: isSelected ? 0.08 : 0.005 // Simple and clean color, removes heavy rectangle blocks
            };
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties;
            layer.bindTooltip(`Ward ${props.ward_number}: ${props.ward_name}`, {
              permanent: false,
              direction: 'center'
            });
            // Click ward to filter
            layer.on('click', () => {
              setSelectedWard(props.ward_number);
            });
          }
        }).addTo(mapRef.current);
        geoJsonLayerRef.current = geoJsonLayer;
        
        // Auto zoom to Panchayat extent
        mapRef.current.fitBounds(geoJsonLayer.getBounds());
      })
      .catch(err => console.error('Failed to load ward boundaries GeoJSON:', err));

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isWardMember, assignedWard]);

  // Handle measurement clicks on map
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
          const line = L.polyline(newPoints, { color: '#B91C1C', weight: 3 }).addTo(map);
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

  // Refresh Markers on Data/Filter Changes
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    // Clear existing markers
    markersGroupRef.current.clearLayers();

    // Filter buildings
    const filteredBuildings = buildings.filter(b => {
      const matchSearch = 
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
      const matchWard = isWardMember ? b.wardNumber === assignedWard : (selectedWard === 'all' || b.wardNumber === selectedWard);

      return matchSearch && matchStatus && matchWard;
    });

    // Add markers
    filteredBuildings.forEach(building => {
      const { lat, lng } = building.coordinates;

      let color = '#64748B'; // simple clean grey
      if (building.status === 'licensed') color = '#10B981'; // emerald green
      else if (building.status === 'unlicensed') color = '#EF4444'; // red (non licensed)
      else if (building.status === 'pending') color = '#F59E0B'; // amber (renewal/pending)
      else if (building.status === 'ngo') color = '#8B5CF6'; // purple (ngo)
      else if (building.status === 'govt') color = '#3B82F6'; // blue (govt)

      // Check if marker should pulse (unlicensed red warnings or pending alerts)
      const needsPulse = building.status === 'unlicensed' || building.status === 'pending';
      const pulseColor = building.status === 'unlicensed' ? 'bg-red-500' : 'bg-amber-400';

      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center" style="width: 20px; height: 20px;">
            ${needsPulse ? `<span class="animate-ping absolute inline-flex h-5 w-5 rounded-full ${pulseColor} opacity-50"></span>` : ''}
            <div style="background-color: ${color}; width: 11px; height: 11px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 10;"></div>
          </div>
        `,
        className: 'custom-building-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Click building to open profile drawer
      marker.on('click', () => {
        setActiveBuilding(building);
        mapRef.current?.setView([lat, lng], 16);
      });

      // Simple tooltip on hover
      marker.bindTooltip(`
        <div class="p-1 font-sans text-xs">
          <strong>${building.businessName}</strong><br/>
          Owner: ${building.ownerName}<br/>
          Status: <span class="capitalize font-semibold">${building.status}</span>
        </div>
      `, { direction: 'top', offset: [0, -5] });

      markersGroupRef.current?.addLayer(marker);
    });
  }, [buildings, searchQuery, selectedStatus, selectedWard, isWardMember, assignedWard]);

  // Update ward highlight style dynamically when selectedWard changes
  useEffect(() => {
    const geoJsonLayer = geoJsonLayerRef.current;
    if (!geoJsonLayer) return;
    
    geoJsonLayer.setStyle((feature) => {
      const wardNum = feature?.properties?.ward_number;
      const isSelected = selectedWard === wardNum;
      return {
        color: '#0F6E4F',
        weight: isSelected ? 3 : 1.5,
        opacity: isSelected ? 1 : 0.4,
        fillColor: '#0F6E4F',
        fillOpacity: isSelected ? 0.08 : 0.005
      };
    });
  }, [selectedWard]);

  // Recenter Map on Panchayat
  const handleRecenter = () => {
    if (mapRef.current && geoJsonLayerRef.current) {
      mapRef.current.fitBounds(geoJsonLayerRef.current.getBounds());
    } else if (mapRef.current) {
      mapRef.current.setView([11.57547, 75.81649], 13);
    }
  };

  // Zoom to a specific building
  const handleZoomToBuilding = (building: BuildingRecord) => {
    setActiveBuilding(building);
    if (mapRef.current) {
      mapRef.current.setView([building.coordinates.lat, building.coordinates.lng], 16);
    }
  };

  // Toggle Measurement Tool
  const toggleMeasurement = () => {
    if (isMeasuring) {
      // Clear measurement shapes
      if (measureLine) {
        mapRef.current?.removeLayer(measureLine);
        setMeasureLine(null);
      }
      setMeasurePoints([]);
      setMeasuredDistance(null);
    }
    setIsMeasuring(!isMeasuring);
  };

  if (currentUser?.role !== 'Secretary' && currentUser?.role !== 'Administrator') {
    return (
      <div className="bg-white border border-gov-border rounded p-6 shadow-sm text-center py-12 text-slate-500 italic text-xs max-w-md mx-auto mt-12">
        <ShieldAlert size={36} className="mx-auto text-red-700 mb-2" />
        <p className="font-bold text-slate-800 text-sm mb-1">ACCESS RESTRICTED</p>
        <p className="mb-4">The GIS Monitor Map is restricted to Panchayat Secretaries and Administrators.</p>
        <p>Your current profile ({currentUser?.role || 'Guest'}) does not hold access permissions.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Sidebar Controls Panel */}
      <div className="w-full lg:w-80 bg-white border border-gov-border rounded-3xl p-5 flex flex-col shadow-sm shrink-0">
        
        {/* Active Panchayat Header */}
        <div className="bg-[#EBF7F2] border border-emerald-100 rounded-2xl p-3.5 mb-4 text-xs flex justify-between items-center text-slate-700">
          <div>
            <span className="text-[9px] font-bold text-[#0F6E4F] uppercase tracking-wide">Panchayat Boundary</span>
            <span className="block font-bold text-slate-800 text-xs mt-0.5">Chakkittapara Panchayat</span>
          </div>
          <span className="bg-[#0F6E4F] text-white px-2.5 py-0.5 rounded-lg font-mono font-bold text-[9px] shrink-0">
            Code: {activePanchayatCode}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search business, owner, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-gov-green focus:ring-1 focus:ring-gov-green"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters Header */}
        <div className="flex items-center space-x-1 text-slate-400 mb-3 font-extrabold text-[10px] uppercase border-b pb-1.5 tracking-wider">
          <Filter size={12} />
          <span>GIS Layers & Filters</span>
        </div>

        {/* Filter Selectors */}
        <div className="space-y-3 mb-4">
          
          {/* Ward Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Filter by Ward Boundary</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={isWardMember}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green disabled:bg-slate-50 font-semibold"
            >
              {isWardMember ? (
                <option value={assignedWard}>Ward {assignedWard} - {wards.find(w => w.id === assignedWard)?.name || `My Ward`}</option>
              ) : (
                <>
                  <option value="all">All Wards (Complete Extent)</option>
                  {wards.map(w => (
                    <option key={w.id} value={w.id}>Ward {w.id} - {w.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Filter License Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green font-semibold"
            >
              <option value="all">All Buildings</option>
              <option value="licensed">Licensed Only (Green)</option>
              <option value="unlicensed">Unlicensed (Red Pulse)</option>
              <option value="pending">Pending Verification (Amber)</option>
              <option value="govt">Government Buildings (Blue)</option>
              <option value="ngo">NGO / Exempt (Purple)</option>
            </select>
          </div>

        </div>

        {/* Actions panel */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleRecenter}
            className="flex items-center justify-center space-x-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-xl text-[10px] font-bold uppercase transition"
          >
            <MapPin size={12} className="text-[#0F6E4F]" />
            <span>Reset View</span>
          </button>
          <button
            onClick={toggleMeasurement}
            className={`flex items-center justify-center space-x-1.5 border py-2 rounded-xl text-[10px] font-bold uppercase transition ${
              isMeasuring 
                ? 'bg-red-50 border-red-300 text-red-700 font-extrabold' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Ruler size={12} className={isMeasuring ? 'text-red-700' : 'text-slate-400'} />
            <span>{isMeasuring ? 'Ruler Active' : 'Measure'}</span>
          </button>
        </div>

        {/* Distance measurement result */}
        {isMeasuring && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-xs text-red-900 mb-4">
            <span className="font-bold block text-[9px] uppercase tracking-wide">Measurement Active</span>
            Click multiple points on the satellite map to measure distance.
            {measuredDistance !== null && (
              <span className="block mt-1.5 font-bold text-sm">
                Distance: {measuredDistance < 1000 
                  ? `${measuredDistance.toFixed(1)} m` 
                  : `${(measuredDistance / 1000).toFixed(3)} km`}
              </span>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="border-t pt-3 flex-1 flex flex-col min-h-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">GIS MAP LEGEND</div>
          <div className="space-y-1.5 mb-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow inline-block" style={{ backgroundColor: '#10B981' }}></span>
              <span>Licensed Building</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow inline-block relative" style={{ backgroundColor: '#EF4444' }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
              </span>
              <span>Unlicensed operating (Alert)</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow inline-block relative" style={{ backgroundColor: '#F59E0B' }}>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
              </span>
              <span>Pending / Renewal Alert</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow inline-block" style={{ backgroundColor: '#3B82F6' }}></span>
              <span>Government (Exempt)</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full border-2 border-white shadow inline-block" style={{ backgroundColor: '#8B5CF6' }}></span>
              <span>NGO / Charitable trust (Exempt)</span>
            </div>
          </div>

          {/* Quick List matching filters */}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Matching Directory</div>
          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 max-h-40 lg:max-h-none border border-slate-100 rounded-xl bg-slate-50/50 p-2">
            {buildings
              .filter(b => {
                const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
                const matchWard = selectedWard === 'all' || b.wardNumber === selectedWard;
                return matchStatus && matchWard;
              })
              .map(b => (
                <button
                  key={b.id}
                  onClick={() => handleZoomToBuilding(b)}
                  className="w-full text-left py-1 text-[10px] hover:text-[#0F6E4F] flex justify-between items-center transition font-semibold text-slate-600"
                >
                  <span className="truncate pr-2">{b.businessName}</span>
                  <span className="font-mono text-slate-400 shrink-0 text-[9px]">{b.id}</span>
                </button>
              ))}
          </div>
        </div>

      </div>

      {/* Main Map Container */}
      <div className="flex-1 bg-slate-200 border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden flex flex-col">
        
        {/* Leaflet map hook */}
        <div ref={mapContainerRef} className="flex-1 w-full z-10" />

        {/* Selected Building Details Drawer overlay */}
        {activeBuilding && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:top-4 lg:bottom-auto w-auto lg:w-96 bg-white border-t-4 border-[#0F6E4F] rounded-2xl shadow-2xl p-4.5 z-20 max-h-[80%] overflow-y-auto text-xs">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">Building: {activeBuilding.id}</span>
                <h4 className="font-bold text-slate-800 text-sm mt-1">{activeBuilding.businessName}</h4>
              </div>
              <button 
                onClick={() => setActiveBuilding(null)}
                className="text-slate-400 hover:text-slate-600 border border-slate-100 rounded-lg p-1 transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 py-2.5 border-t border-b border-slate-50 text-slate-700 font-semibold">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Owner Name</span>
                <span className="font-medium">{activeBuilding.ownerName}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Category</span>
                <span className="font-medium">{activeBuilding.category}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Ward Boundary</span>
                <span className="font-mono font-medium">Ward {activeBuilding.wardNumber}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">License Reference</span>
                <span className="font-mono font-medium">{activeBuilding.licenseId || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">GPS Location Coordinates</span>
                <span className="font-medium font-mono text-slate-500">{activeBuilding.coordinates.lat.toFixed(5)}, {activeBuilding.coordinates.lng.toFixed(5)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                activeBuilding.status === 'licensed' 
                  ? 'bg-green-50 text-status-licensed' 
                  : activeBuilding.status === 'unlicensed' 
                    ? 'bg-red-50 text-status-unlicensed' 
                    : activeBuilding.status === 'pending' 
                      ? 'bg-amber-50 text-status-pending'
                      : 'bg-blue-50 text-status-govt'
              }`}>
                {activeBuilding.status === 'licensed' ? 'Licensed' : activeBuilding.status === 'unlicensed' ? 'Unlicensed' : activeBuilding.status === 'pending' ? 'Pending Approval' : 'Govt (Exempt)'}
              </span>
              
              <Link
                to={`/buildings?id=${activeBuilding.id}`}
                className="flex items-center space-x-1 text-[#0F6E4F] font-bold text-[9px] uppercase hover:underline"
              >
                <Eye size={12} />
                <span>View Full Registry File</span>
              </Link>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
