import React, { useEffect, useRef } from "react";
import L from "leaflet";

function parseValidLatLng(coords) {
  if (!coords) return null;
  let lat;
  let lng;

  if (Array.isArray(coords) && coords.length >= 2) {
    lat = typeof coords[0] === "number" ? coords[0] : parseFloat(String(coords[0]));
    lng = typeof coords[1] === "number" ? coords[1] : parseFloat(String(coords[1]));
  } else if (typeof coords === "object" && coords !== null) {
    const rawLat = coords.lat ?? coords.latitude;
    const rawLng = coords.lng ?? coords.lon ?? coords.longitude;
    lat = typeof rawLat === "number" ? rawLat : parseFloat(String(rawLat));
    lng = typeof rawLng === "number" ? rawLng : parseFloat(String(rawLng));
  }

  if (
    lat !== undefined &&
    lng !== undefined &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  ) {
    return [lat, lng];
  }
  return null;
}

export const RiskMap = ({
  transects = [],
  selectedTransect = null,
  onSelectTransect = () => {}
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const getMarkerColor = (level) => {
    switch (level) {
      case "Very High": return "#f43f5e";
      case "High": return "#f97316";
      case "Medium": return "#eab308";
      case "Low":
      default: return "#10b981";
    }
  };

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: [42.25, 14.5],
        zoom: 9,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd"
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    transects.forEach((t) => {
      const validCoords = parseValidLatLng(t.coordinates);
      if (!validCoords) return;

      const color = getMarkerColor(t.risk_class);
      const isSelected = selectedTransect?.id === t.id;

      const customIcon = L.divIcon({
        className: "custom-coastal-pin",
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? "32px" : "24px"};
            height: ${isSelected ? "32px" : "24px"};
            background: ${color};
            border: 3px solid #0f172a;
            border-radius: 50%;
            box-shadow: 0 0 10px ${color};
            cursor: pointer;
          ">
            <div style="width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12]
      });

      const marker = L.marker(validCoords, { icon: customIcon });
      marker.on("click", () => onSelectTransect(t));
      marker.addTo(layerGroupRef.current);
    });
  }, [transects, selectedTransect]);

  useEffect(() => {
    if (selectedTransect && mapInstanceRef.current) {
      const validCoords = parseValidLatLng(selectedTransect.coordinates);
      if (validCoords) {
        mapInstanceRef.current.flyTo(validCoords, 11, { duration: 1.2 });
      }
    }
  }, [selectedTransect]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
};
