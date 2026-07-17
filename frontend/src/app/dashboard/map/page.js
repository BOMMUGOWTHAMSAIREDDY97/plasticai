"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MapPin, Search, PlusCircle, Building2, Server, Milestone, Loader2, ArrowRight } from "lucide-react";

export default function MapDashboard() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
          if (data.length > 0) {
            setSelectedLocation(data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load map locations:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = typeFilter === "all" || loc.type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
          <Map className="text-primary w-8 h-8" /> Interactive Map Dashboard
        </h1>
        <p className="text-textSecondary">Geographic monitoring, routing optimization, and real-time telemetry of regional facility operations.</p>
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
                placeholder="Search facilities..."
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
                All
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
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 uppercase tracking-wider ${
                        loc.type === "Collection Center" ? "bg-emerald-400/20 text-emerald-400" : "bg-sky-400/20 text-sky-400"
                      }`}>
                        {loc.type === "Collection Center" ? "Center" : "Plant"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-textSecondary">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{loc.city}, {loc.district}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Map Grid Visualization */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-glassBorder/30 bg-surface/30 flex flex-col h-full overflow-hidden relative">
            {/* The Stylized Interactive Map Container */}
            <div className="flex-1 bg-surfaceHighlight/20 relative overflow-hidden border-b border-glassBorder/30">
              
              {/* Decorative grid overlay simulating map coordinates */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0 opacity-10 pointer-events-none">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border-t border-l border-white" />
                ))}
              </div>

              {/* Vector abstract paths (rivers, roads simulation) */}
              <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 300 Q 200 150 400 350 T 800 200" fill="none" stroke="#ffffff" strokeWidth="8" />
                <path d="M 300 0 Q 350 200 280 400 T 400 800" fill="none" stroke="#ffffff" strokeWidth="4" />
              </svg>

              {/* Pulsing Markers */}
              {filteredLocations.map((loc) => {
                const isSelected = selectedLocation && selectedLocation.id === loc.id;
                
                // Transform geographical lat/long into abstract map coordinates (anchored around Hyderabad range)
                const latMin = 17.34, latMax = 17.46;
                const lngMin = 78.36, lngMax = 78.55;
                
                const pctY = 100 - ((loc.latitude - latMin) / (latMax - latMin)) * 100;
                const pctX = ((loc.longitude - lngMin) / (lngMax - lngMin)) * 100;

                // Guard constraints
                const posX = Math.max(10, Math.min(90, pctX));
                const posY = Math.max(10, Math.min(90, pctY));

                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                  >
                    {/* Ripple animation */}
                    <div className={`absolute -inset-4 rounded-full animate-ping opacity-25 ${
                      loc.type === "Collection Center" ? "bg-emerald-500" : "bg-sky-500"
                    }`} style={{ animationDuration: '3s' }} />

                    {/* Marker Pin */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                      isSelected 
                        ? "scale-125 bg-white border-primary shadow-2xl z-20" 
                        : "bg-surfaceHighlight border-glassBorder group-hover:scale-110"
                    }`}>
                      <MapPin className={`w-4 h-4 ${
                        isSelected 
                          ? "text-primary fill-primary" 
                          : loc.type === "Collection Center" ? "text-emerald-400" : "text-sky-400"
                      }`} />
                    </div>

                    {/* Simple Tooltip on Hover */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur border border-glassBorder text-[10px] text-white px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                      {loc.name}
                    </div>
                  </div>
                );
              })}

              {/* Selected Location Card overlays */}
              <AnimatePresence>
                {selectedLocation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-glassBorder bg-background/95 backdrop-blur shadow-2xl z-10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          selectedLocation.type === "Collection Center" ? "bg-emerald-400/20 text-emerald-400" : "bg-sky-400/20 text-sky-400"
                        }`}>
                          {selectedLocation.type}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1.5">{selectedLocation.name}</h3>
                        <p className="text-xs text-textSecondary mt-0.5">{selectedLocation.city}, {selectedLocation.district}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm bg-surface/40 p-3 rounded-lg border border-glassBorder/50">
                        <div>
                          <span className="text-[10px] text-textSecondary uppercase font-semibold">Capacity</span>
                          <p className="font-extrabold text-white mt-0.5">{selectedLocation.capacity}</p>
                        </div>
                        {selectedLocation.current_load && (
                          <div>
                            <span className="text-[10px] text-textSecondary uppercase font-semibold">Load / Eff</span>
                            <p className="font-extrabold text-sky-400 mt-0.5">{selectedLocation.current_load} ({selectedLocation.efficiency})</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Map footer coordinates bar */}
            <div className="p-3 bg-surfaceHighlight/30 text-[10px] text-textSecondary flex justify-between">
              <span>Grid Projection: ESPG:3857 (Web Mercator)</span>
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
