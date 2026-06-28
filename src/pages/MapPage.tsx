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
  
  // Measurement state
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<L.LatLng[]>([]);
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

    // Base OSM tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | LSGD Kerala'
    }).addTo(map);

    // Initialize markers group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Load Ward Boundaries GeoJSON
    fetch('/data/chakkittapara_wards.geojson')
      .then(res => res.json())
      .then(geoJsonData => {
        const geoJsonLayer = L.geoJSON(geoJsonData, {
          filter: (feature) => {
            return !isWardMember || feature?.properties?.ward_number === assignedWard;
          },
          style: (feature) => {
            const wardNum = feature?.properties?.ward_number;
            // Cycle colors for wards
            const colors = ['#1E5128', '#0B192C', '#3F4E4F', '#A27B5C', '#2C363F', '#D6CDA4'];
            const color = colors[parseInt(wardNum || '0') % colors.length];
            return {
              color: color,
              weight: 2,
              opacity: 0.7,
              fillColor: color,
              fillOpacity: 0.08
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
        }).addTo(map);
        geoJsonLayerRef.current = geoJsonLayer;
        
        // Auto zoom to Panchayat extent
        map.fitBounds(geoJsonLayer.getBounds());
      })
      .catch(err => console.error('Failed to load ward boundaries GeoJSON:', err));

    // Handle measurement clicks on map
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!isMeasuring) return;

      const newPoints = [...measurePoints, e.latlng];
      setMeasurePoints(newPoints);

      if (newPoints.length > 1) {
        // Draw line
        if (measureLine) {
          measureLine.setLatLngs(newPoints);
        } else {
          const line = L.polyline(newPoints, { color: '#B91C1C', weight: 3 }).addTo(map);
          setMeasureLine(line);
        }

        // Calculate cumulative distance
        let totalDist = 0;
        for (let i = 1; i < newPoints.length; i++) {
          totalDist += newPoints[i-1].distanceTo(newPoints[i]);
        }
        setMeasuredDistance(totalDist);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMeasuring, measurePoints, isWardMember, assignedWard]);

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

      let color = '#4B5563'; // inactive
      if (building.status === 'licensed') color = '#15803D'; // green
      else if (building.status === 'unlicensed') color = '#B91C1C'; // red
      else if (building.status === 'pending') color = '#B45309'; // amber
      else if (building.status === 'govt') color = '#1D4ED8'; // blue
      else if (building.status === 'ngo') color = '#7C3AED'; // purple

      const customIcon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1.5px 3.5px rgba(0,0,0,0.5)"></div>`,
        className: 'custom-building-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
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
      <div className="w-full lg:w-80 bg-white border border-gov-border rounded p-4 flex flex-col shadow-sm shrink-0">
        
        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search business, owner, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters Header */}
        <div className="flex items-center space-x-1 text-slate-500 mb-3 font-bold text-[10px] uppercase border-b pb-1.5">
          <Filter size={12} />
          <span>GIS Layers & Filters</span>
        </div>

        {/* Filter Selectors */}
        <div className="space-y-3 mb-4">
          
          {/* Ward Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter by Ward Boundary</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={isWardMember}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green disabled:bg-slate-50"
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter License Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-gov-green"
            >
              <option value="all">All Buildings</option>
              <option value="licensed">Licensed Only (Green)</option>
              <option value="unlicensed">Unlicensed (Red)</option>
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
            className="flex items-center justify-center space-x-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 py-1.5 rounded text-[10px] font-bold uppercase transition"
          >
            <MapPin size={12} />
            <span>Reset View</span>
          </button>
          <button
            onClick={toggleMeasurement}
            className={`flex items-center justify-center space-x-1.5 border py-1.5 rounded text-[10px] font-bold uppercase transition ${
              isMeasuring 
                ? 'bg-red-50 border-red-300 text-red-700 font-extrabold' 
                : 'border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Ruler size={12} />
            <span>{isMeasuring ? 'Ruler Active' : 'Measure'}</span>
          </button>
        </div>

        {/* Distance measurement result */}
        {isMeasuring && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-900 mb-4">
            <span className="font-bold block text-[10px] uppercase">Measurement Active</span>
            Click multiple points on the map to measure.
            {measuredDistance !== null && (
              <span className="block mt-1 font-bold text-sm">
                Distance: {measuredDistance < 1000 
                  ? `${measuredDistance.toFixed(1)} m` 
                  : `${(measuredDistance / 1000).toFixed(3)} km`}
              </span>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="border-t pt-3 flex-1 flex flex-col min-h-0">
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">GIS MAP LEGEND</div>
          <div className="space-y-1.5 mb-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full border border-white shadow bg-status-licensed inline-block"></span>
              <span className="text-slate-700">Licensed commercial building</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full border border-white shadow bg-status-unlicensed inline-block"></span>
              <span className="text-slate-700">Unlicensed operating business</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full border border-white shadow bg-status-pending inline-block"></span>
              <span className="text-slate-700">Pending survey verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full border border-white shadow bg-status-govt inline-block"></span>
              <span className="text-slate-700">Government building (Exempt)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-full border border-white shadow bg-purple-600 inline-block"></span>
              <span className="text-slate-700">NGO / Charitable trust (Exempt)</span>
            </div>
          </div>

          {/* Quick List matching filters */}
          <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Matching Directory</div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-48 lg:max-h-none border rounded bg-slate-50 p-1.5">
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
                  className="w-full text-left py-1 text-[10px] hover:text-gov-green flex justify-between items-center"
                >
                  <span className="font-medium truncate pr-2">{b.businessName}</span>
                  <span className="font-mono text-slate-400 shrink-0">{b.id}</span>
                </button>
              ))}
          </div>
        </div>

      </div>

      {/* Main Map Container */}
      <div className="flex-1 bg-slate-200 border border-gov-border rounded shadow-sm relative overflow-hidden flex flex-col">
        
        {/* Leaflet map hook */}
        <div ref={mapContainerRef} className="flex-1 w-full z-10" />

        {/* Selected Building Details Drawer overlay */}
        {activeBuilding && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:top-4 lg:bottom-auto w-auto lg:w-96 bg-white border-t-4 border-gov-navy rounded shadow-2xl p-4 z-20 max-h-[80%] overflow-y-auto text-xs">
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 bg-slate-100 px-1 rounded">Building: {activeBuilding.id}</span>
                <h4 className="font-bold text-slate-800 text-sm mt-0.5">{activeBuilding.businessName}</h4>
              </div>
              <button 
                onClick={() => setActiveBuilding(null)}
                className="text-slate-400 hover:text-slate-600 border rounded p-0.5"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-2 border-t border-b border-slate-100 text-slate-700">
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
                <span className="font-medium font-mono">Ward {activeBuilding.wardNumber}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">License Reference</span>
                <span className="font-medium font-mono">{activeBuilding.licenseId || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">GPS Location Coordinates</span>
                <span className="font-medium font-mono">{activeBuilding.coordinates.lat.toFixed(5)}, {activeBuilding.coordinates.lng.toFixed(5)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                activeBuilding.status === 'licensed' 
                  ? 'bg-green-50 text-status-licensed' 
                  : activeBuilding.status === 'unlicensed' 
                    ? 'bg-red-50 text-status-unlicensed' 
                    : activeBuilding.status === 'pending' 
                      ? 'bg-amber-50 text-status-pending'
                      : 'bg-blue-50 text-status-govt'
              }`}>
                {activeBuilding.status === 'licensed' ? 'Licensed' : activeBuilding.status === 'unlicensed' ? 'Unlicensed' : activeBuilding.status === 'pending' ? 'Pending Approval' : 'Govt Building'}
              </span>
              
              <Link
                to={`/buildings?id=${activeBuilding.id}`}
                className="flex items-center space-x-1 text-gov-green font-bold text-[10px] uppercase hover:underline"
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
