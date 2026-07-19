"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MapPin, Search, Loader2 } from "lucide-react";

export default function MapDashboard() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);

  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Load Leaflet assets dynamically to prevent Next.js server-side rendering (SSR) issues
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletReady(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup leaflet elements on unmount
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // Fetch facilities list
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/locations`, { headers });
        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        }
      } catch (err) {
        console.error("Failed to load map locations:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // Group locations by state when "all" filter is selected to display 1 clean marker per state
  const displayLocations = (() => {
    if (typeFilter !== "all") {
      return locations.filter(loc => loc.type === typeFilter);
    }

    // Grouping logic for "All"
    const stateGroups = {};
    locations.forEach(loc => {
      if (!stateGroups[loc.state]) {
        stateGroups[loc.state] = [];
      }
      stateGroups[loc.state].push(loc);
    });

    return Object.entries(stateGroups).map(([state, items]) => {
      const center = items.find(i => i.type === "Collection Center") || items[0];
      const plant = items.find(i => i.type === "Recycling Plant");
      return {
        id: `hub_${state.replace(/\s+/g, "_")}`,
        name: `${center.city} Unified Hub`,
        type: "Unified State Hub",
        latitude: center.latitude,
        longitude: center.longitude,
        district: center.district,
        city: center.city,
        state: state,
        collectionCenter: center,
        recyclingPlant: plant,
        capacity: center.capacity,
        color: "primary"
      };
    });
  })();

  const filteredLocations = displayLocations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          loc.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Initialize Map
  useEffect(() => {
    if (!leafletReady || displayLocations.length === 0) return;

    const L = window.L;
    if (!L) return;

    // Create the Leaflet map instance centered in the middle of India
    if (!mapRef.current) {
      const map = L.map("map-container", { zoomControl: false }).setView([22.9734, 78.6569], 5);
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add a premium dark theme map layer from CartoDB matching the dashboard's design system
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear any previous markers to avoid duplicates
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add markers for all display locations
    const newMarkers = [];
    displayLocations.forEach(loc => {
      const isSelected = selectedLocation && selectedLocation.id === loc.id;
      let color = "#6366f1"; // default purple for Unified Hubs
      if (loc.type === "Collection Center") color = "#10b981"; // emerald
      if (loc.type === "Recycling Plant") color = "#0ea5e9"; // sky blue

      const marker = L.circleMarker([loc.latitude, loc.longitude], {
        radius: isSelected ? 10 : 7,
        fillColor: color,
        color: isSelected ? "#ffffff" : color,
        weight: isSelected ? 2.5 : 1,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      // Leaflet Popup binding
      if (loc.type === "Unified State Hub") {
        marker.bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 4px;">
            <b style="font-size: 13px; color: #1e293b;">${loc.city} Unified Hub</b><br/>
            <span style="color: #6366f1; font-size: 9px; font-weight: bold; text-transform: uppercase;">${loc.state}</span><br/>
            <div style="margin-top: 5px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <b>Centers:</b> ${loc.collectionCenter ? "1 Depot Active" : "None"}<br/>
              <b>Plants:</b> ${loc.recyclingPlant ? "1 Plant Active" : "None"}
            </div>
          </div>
        `);
      } else {
        marker.bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; padding: 4px;">
            <b style="font-size: 13px; color: #1e293b;">${loc.name}</b><br/>
            <span style="color: ${color}; font-size: 9px; font-weight: bold; text-transform: uppercase;">${loc.type}</span><br/>
            <div style="margin-top: 5px;">
              <b>City:</b> ${loc.city}, ${loc.state}<br/>
              <b>Capacity:</b> ${loc.capacity}
            </div>
          </div>
        `);
      }

      marker.on('click', () => {
        setSelectedLocation(loc);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;
  }, [leafletReady, displayLocations]);

  // Handle selected location tracking & map centering
  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.setView([selectedLocation.latitude, selectedLocation.longitude], 12);
      
      // Update marker visual styles dynamically (highlighting the selected one)
      markersRef.current.forEach(marker => {
        const latLng = marker.getLatLng();
        // Match marker coordinates to highlight the selected item
        const isTarget = Math.abs(latLng.lat - selectedLocation.latitude) < 0.0001 && 
                         Math.abs(latLng.lng - selectedLocation.longitude) < 0.0001;
        
        let color = "#6366f1";
        if (selectedLocation.type === "Collection Center") color = "#10b981";
        if (selectedLocation.type === "Recycling Plant") color = "#0ea5e9";
        
        marker.setStyle({
          radius: isTarget ? 11 : 7,
          color: isTarget ? "#ffffff" : color,
          weight: isTarget ? 3.5 : 1
        });
      });
    }
  }, [selectedLocation]);

  // If filter changes, reset selectedLocation to avoid state mismatches
  useEffect(() => {
    setSelectedLocation(null);
  }, [typeFilter]);

  return (
    <div className="space-y-6">
      {/* Dynamic styles to blend Leaflet popups with our glassmorphism design */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container {
          background: #090d16 !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95) !important;
          color: #f8fafc !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
        }
        .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-bar {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: none !important;
        }
        .leaflet-bar a {
          background-color: rgba(15, 23, 42, 0.85) !important;
          color: #f8fafc !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          transition: background-color 0.2s;
        }
        .leaflet-bar a:hover {
          background-color: rgba(30, 41, 59, 0.95) !important;
        }
      `}} />

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <Map className="text-primary w-8 h-8" /> Interactive Map Dashboard
        </h1>
        <p className="text-textSecondary">Geographic monitoring, routing optimization, and real-time telemetry of regional facility operations across India.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
          
          {/* Left panel: Facilities List */}
          <div className="glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 p-5 flex flex-col h-full overflow-hidden">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-textSecondary absolute left-3.5 top-3" />
              <input 
                type="text" 
                placeholder="Search facilities or states..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-glassBorder rounded-xl pl-10 pr-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => setTypeFilter("all")}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  typeFilter === "all" ? "bg-primary/20 text-primary border border-primary/30" : "bg-surfaceHighlight/50 text-textSecondary"
                }`}
              >
                All (Unified)
              </button>
              <button 
                onClick={() => setTypeFilter("Collection Center")}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  typeFilter === "Collection Center" ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" : "bg-surfaceHighlight/50 text-textSecondary"
                }`}
              >
                Centers
              </button>
              <button 
                onClick={() => setTypeFilter("Recycling Plant")}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  typeFilter === "Recycling Plant" ? "bg-sky-400/20 text-sky-400 border border-sky-400/30" : "bg-surfaceHighlight/50 text-textSecondary"
                }`}
              >
                Plants
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation && selectedLocation.id === loc.id;
                let colorClass = "bg-indigo-400/20 text-indigo-400";
                if (loc.type === "Collection Center") colorClass = "bg-emerald-400/20 text-emerald-400";
                if (loc.type === "Recycling Plant") colorClass = "bg-sky-400/20 text-sky-400";

                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "border-primary/50 bg-primary/10 shadow-lg" 
                        : "border-glassBorder bg-surface/50 hover:bg-surfaceHover"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{loc.name}</h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 uppercase tracking-wider ${colorClass}`}>
                        {loc.type === "Unified State Hub" ? "Hub" : loc.type === "Collection Center" ? "Center" : "Plant"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-textSecondary">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{loc.city}, {loc.state}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Real Leaflet Map */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 flex flex-col h-full overflow-hidden relative">
            <div className="flex-1 relative overflow-hidden border-b border-glassBorder/30 min-h-[300px]">
              {/* Map div container */}
              <div id="map-container" className="w-full h-full absolute inset-0 z-0" />

              {/* Detail overlays showing coordinates and status */}
              <AnimatePresence>
                {selectedLocation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-glassBorder bg-background/90 backdrop-blur-md shadow-2xl z-10"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-glassBorder/30 pb-2">
                        <div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            selectedLocation.type === "Unified State Hub" 
                              ? "bg-indigo-400/20 text-indigo-400 border border-indigo-400/30" 
                              : selectedLocation.type === "Collection Center" 
                              ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30" 
                              : "bg-sky-400/20 text-sky-400 border border-sky-400/30"
                          }`}>
                            {selectedLocation.type}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-1.5">{selectedLocation.name}</h3>
                          <p className="text-xs text-textSecondary mt-0.5">{selectedLocation.city}, {selectedLocation.state}</p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-primaryHover text-xs font-bold text-white shadow-lg transition-all"
                        >
                          <MapPin className="w-3.5 h-3.5 fill-white text-primary" />
                          Google Maps
                        </a>
                      </div>

                      {/* Facilities Information */}
                      {selectedLocation.type === "Unified State Hub" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Collection Center Depot Details */}
                          {selectedLocation.collectionCenter && (
                            <div className="bg-emerald-400/5 p-3 rounded-lg border border-emerald-400/20">
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-400">
                                Collection Depot
                              </span>
                              <h4 className="font-bold text-white mt-2 text-sm">{selectedLocation.collectionCenter.name}</h4>
                              <p className="text-xs text-textSecondary mt-1">Capacity: {selectedLocation.collectionCenter.capacity}</p>
                            </div>
                          )}

                          {/* Recycling Plant Details */}
                          {selectedLocation.recyclingPlant && (
                            <div className="bg-sky-400/5 p-3 rounded-lg border border-sky-400/20">
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sky-400/20 text-sky-400">
                                Recycling Plant
                              </span>
                              <h4 className="font-bold text-white mt-2 text-sm">{selectedLocation.recyclingPlant.name}</h4>
                              <p className="text-xs text-textSecondary mt-1">
                                Capacity: {selectedLocation.recyclingPlant.capacity} | Load: {selectedLocation.recyclingPlant.current_load} ({selectedLocation.recyclingPlant.efficiency} Eff)
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm bg-surface/40 p-3 rounded-lg border border-glassBorder/50">
                          <div>
                            <span className="text-[10px] text-textSecondary uppercase font-semibold">Capacity</span>
                            <p className="font-extrabold text-white mt-0.5">{selectedLocation.capacity}</p>
                          </div>
                          {selectedLocation.current_load ? (
                            <div>
                              <span className="text-[10px] text-textSecondary uppercase font-semibold">Load / Eff</span>
                              <p className="font-extrabold text-sky-400 mt-0.5">{selectedLocation.current_load} ({selectedLocation.efficiency})</p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[10px] text-textSecondary uppercase font-semibold">Role</span>
                              <p className="font-extrabold text-emerald-400 mt-0.5">Collection</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Map footer coordinates bar */}
            <div className="p-3 bg-surfaceHighlight/30 text-[10px] text-textSecondary flex justify-between">
              <span>Map Tiles: OpenStreetMap (CartoDB Dark Matter)</span>
              {selectedLocation && (
                <span>Lat: {selectedLocation.latitude.toFixed(6)} | Long: {selectedLocation.longitude.toFixed(6)}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
