import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import L from "leaflet";
import { CoastalTransect, RiskLevel, DisasterAlert } from "../types";
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Flame, 
  Sliders, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Check,
  ShieldCheck,
  ShieldAlert,
  Route,
  ArrowRight,
  Footprints,
  Car,
  Clock,
  Building,
  HeartPulse,
  Radio,
  ExternalLink,
  X,
  Compass,
  CheckCircle2,
  Mountain,
  Satellite,
  ScanEye,
  Maximize2
} from "lucide-react";
import {
  getSusceptibilityScore,
  getSusceptibilityColor,
  getSusceptibilityTier,
  parseValidLatLng,
  renderSusceptibilityHeatmap,
  getCriticalHotspots,
  SUSCEPTIBILITY_TIERS
} from "../utils/heatmapRenderer";
import {
  EvacuationRoute,
  SafeZone,
  getAllEvacuationRoutes,
  getUniqueSafeZones,
  computeEvacuationNetworkSummary
} from "../utils/evacuationRoutes";
import { evaluate3DayDisasterAlerts } from "../api/liveData";
import {
  COPERNICUS_MISSION_SPEC,
  getCopernicusGroundObservation,
  CopernicusGroundObservation
} from "../utils/copernicusGroundTruth";

interface RiskMapProps {
  transects: CoastalTransect[];
  selectedTransect: CoastalTransect | null;
  onSelectTransect: (transect: CoastalTransect) => void;
  isHeatmapActive?: boolean;
  onToggleHeatmap?: (active: boolean) => void;
  isEvacuationActive?: boolean;
  onToggleEvacuation?: (active: boolean) => void;
  isSatelliteActive?: boolean;
  onToggleSatellite?: (active: boolean) => void;
  activeAlert?: DisasterAlert | null;
  onOpenDisasterCenter?: () => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  transects,
  selectedTransect,
  onSelectTransect,
  isHeatmapActive: controlledHeatmapActive,
  onToggleHeatmap,
  isEvacuationActive: controlledEvacuationActive,
  onToggleEvacuation,
  isSatelliteActive: controlledSatelliteActive,
  onToggleSatellite,
  activeAlert: providedActiveAlert,
  onOpenDisasterCenter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const evacuationLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const heatmapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Satellite and base layer references
  const cartoLayerRef = useRef<L.TileLayer | null>(null);
  const copernicusLayerRef = useRef<L.TileLayer | null>(null);
  const highresLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);

  // Active Disaster Alert fallback if not passed directly
  const activeAlert = useMemo(() => {
    if (providedActiveAlert !== undefined) return providedActiveAlert;
    const alerts = evaluate3DayDisasterAlerts(transects);
    return alerts.length > 0 ? alerts[0] : null;
  }, [providedActiveAlert, transects]);

  // Internal state when not externally controlled
  const [internalHeatmapActive, setInternalHeatmapActive] = useState<boolean>(true);
  const isHeatmapActive = controlledHeatmapActive !== undefined ? controlledHeatmapActive : internalHeatmapActive;

  const [internalEvacuationActive, setInternalEvacuationActive] = useState<boolean>(true);
  const isEvacuationActive = controlledEvacuationActive !== undefined ? controlledEvacuationActive : internalEvacuationActive;

  // Real-time Copernicus Satellite state
  const [internalSatelliteActive, setInternalSatelliteActive] = useState<boolean>(true);
  const isSatelliteActive = controlledSatelliteActive !== undefined ? controlledSatelliteActive : internalSatelliteActive;

  const [satelliteVariant, setSatelliteVariant] = useState<"sentinel2" | "highres">("sentinel2");
  const [satelliteOpacity, setSatelliteOpacity] = useState<number>(100);
  const [showCoastalLabels, setShowCoastalLabels] = useState<boolean>(true);
  const [showSatelliteSettings, setShowSatelliteSettings] = useState<boolean>(false);
  const [showGroundCrossReference, setShowGroundCrossReference] = useState<boolean>(true);
  const [isGroundInspectorMinimized, setIsGroundInspectorMinimized] = useState<boolean>(false);

  // Evacuation route selection & filter state
  const [selectedEvacRouteId, setSelectedEvacRouteId] = useState<string | null>(null);
  const [filterHighRiskOnly, setFilterHighRiskOnly] = useState<boolean>(true);
  const [isEvacInspectorMinimized, setIsEvacInspectorMinimized] = useState<boolean>(false);

  // Heatmap configuration settings
  const [heatmapRadius, setHeatmapRadius] = useState<number>(55);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(75);
  const [showScoreBadges, setShowScoreBadges] = useState<boolean>(true);
  const [showSettingsPopover, setShowSettingsPopover] = useState<boolean>(false);
  const [activeLegendTab, setActiveLegendTab] = useState<"gradient" | "categories" | "evacuation" | "satellite">("satellite");

  const handleToggleHeatmap = () => {
    const nextState = !isHeatmapActive;
    if (onToggleHeatmap) {
      onToggleHeatmap(nextState);
    } else {
      setInternalHeatmapActive(nextState);
    }
  };

  const handleToggleEvacuation = () => {
    const nextState = !isEvacuationActive;
    if (onToggleEvacuation) {
      onToggleEvacuation(nextState);
    } else {
      setInternalEvacuationActive(nextState);
    }
    if (nextState) {
      setActiveLegendTab("evacuation");
    } else if (activeLegendTab === "evacuation") {
      setActiveLegendTab(isSatelliteActive ? "satellite" : "gradient");
    }
  };

  const handleToggleSatellite = () => {
    const nextState = !isSatelliteActive;
    if (onToggleSatellite) {
      onToggleSatellite(nextState);
    } else {
      setInternalSatelliteActive(nextState);
    }
    if (nextState && activeLegendTab !== "evacuation") {
      setActiveLegendTab("satellite");
    } else if (!nextState && activeLegendTab === "satellite") {
      setActiveLegendTab(isHeatmapActive ? "gradient" : "categories");
    }
  };

  // Identify high-risk hotspots (susceptibility score >= 70%)
  const criticalHotspots = useMemo(() => {
    return getCriticalHotspots(transects, 70).sort(
      (a, b) => getSusceptibilityScore(b) - getSusceptibilityScore(a)
    );
  }, [transects]);

  // Generate Evacuation Routes for current transects and active alert
  const evacuationRoutes = useMemo(() => {
    return getAllEvacuationRoutes(transects, activeAlert);
  }, [transects, activeAlert]);

  const highRiskEvacRoutes = useMemo(() => {
    return evacuationRoutes.filter((r) => r.is_high_risk_disaster_target);
  }, [evacuationRoutes]);

  const networkSummary = useMemo(() => {
    return computeEvacuationNetworkSummary(evacuationRoutes);
  }, [evacuationRoutes]);

  // Selected route object for inspector
  const selectedEvacRoute = useMemo(() => {
    if (selectedEvacRouteId) {
      const found = evacuationRoutes.find((r) => r.id === selectedEvacRouteId);
      if (found) return found;
    }
    if (selectedTransect) {
      const found = evacuationRoutes.find((r) => r.origin_transect_id === selectedTransect.id);
      if (found) return found;
    }
    // Default to the highest-risk route if none selected
    return highRiskEvacRoutes.length > 0 ? highRiskEvacRoutes[0] : evacuationRoutes[0] || null;
  }, [selectedEvacRouteId, selectedTransect, evacuationRoutes, highRiskEvacRoutes]);

  // Average susceptibility index
  const avgSusceptibility = useMemo(() => {
    if (transects.length === 0) return 0;
    const sum = transects.reduce((acc, t) => acc + getSusceptibilityScore(t), 0);
    return Math.round((sum / transects.length) * 10) / 10;
  }, [transects]);

  // Redraw heatmap throttled with requestAnimationFrame
  const requestHeatmapRedraw = useCallback(() => {
    if (!heatmapCanvasRef.current || !mapInstanceRef.current) return;
    
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    animFrameRef.current = requestAnimationFrame(() => {
      const map = mapInstanceRef.current;
      const canvas = heatmapCanvasRef.current;
      if (!map || !canvas) return;

      if (!isHeatmapActive) {
        canvas.style.display = "none";
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      canvas.style.display = "block";
      // Position canvas in Leaflet overlay coordinates
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      renderSusceptibilityHeatmap(canvas, map, transects, {
        radius: heatmapRadius,
        opacity: heatmapOpacity,
        blur: 1.0
      });
    });
  }, [isHeatmapActive, heatmapRadius, heatmapOpacity, transects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize Map, Heatmap Canvas Pane & Evacuation Layers
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Clear any dangling Leaflet DOM attachment if re-mounting
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Initialize Leaflet Map centered on Adriatic Abruzzo coast
      const map = L.map(mapContainerRef.current, {
        center: [42.25, 14.5],
        zoom: 9,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager raster tiles for high-contrast visibility
      const cartoLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd"
      });
      cartoLayer.addTo(map);
      cartoLayerRef.current = cartoLayer;

      // Custom pane for satellite imagery so it sits between baseline and heatmap (zIndex 220)
      if (!map.getPane("satellitePane")) {
        const satPane = map.createPane("satellitePane");
        satPane.style.zIndex = "220";
      }

      // Custom pane for cartographic place & harbor labels (zIndex 380, above heatmap canvas, below evac routes & markers)
      if (!map.getPane("coastalLabelsPane")) {
        const lblPane = map.createPane("coastalLabelsPane");
        lblPane.style.zIndex = "380";
        lblPane.style.pointerEvents = "none";
      }

      // Copernicus Sentinel-2 True Color Cloudless Mosaic (European Space Agency / EOX)
      const copernicus = L.tileLayer(
        "https://{s}.tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg",
        {
          maxZoom: 18,
          subdomains: ["a", "b", "c", "d", "e"],
          pane: "satellitePane",
          attribution: '&copy; Copernicus Sentinel-2 cloudless by EOX'
        }
      );
      copernicusLayerRef.current = copernicus;

      // High-resolution World Orthophoto (Esri World Imagery) for sub-meter coastal detail
      const highres = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          pane: "satellitePane",
          attribution: 'Tiles &copy; Esri, Maxar'
        }
      );
      highresLayerRef.current = highres;

      // Place / Harbor Labels Overlay
      const labels = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          pane: "coastalLabelsPane"
        }
      );
      labelsLayerRef.current = labels;

      // Custom pane for the Susceptibility Heatmap Canvas (zIndex 350)
      if (!map.getPane("susceptibilityHeatmapPane")) {
        const pane = map.createPane("susceptibilityHeatmapPane");
        pane.style.zIndex = "350";
        pane.style.pointerEvents = "none";
      }

      // Custom pane for Evacuation Corridors & Safe Zones (zIndex 450)
      if (!map.getPane("evacuationRoutesPane")) {
        const pane = map.createPane("evacuationRoutesPane");
        pane.style.zIndex = "450";
      }

      const pane = map.getPane("susceptibilityHeatmapPane")!;
      let canvas = heatmapCanvasRef.current;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "coastal-susceptibility-canvas";
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.pointerEvents = "none";
        pane.appendChild(canvas);
        heatmapCanvasRef.current = canvas;
      }

      layerGroupRef.current = L.layerGroup().addTo(map);
      evacuationLayerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Attach map move/zoom listeners for continuous dynamic heatmap updating
    map.on("move", requestHeatmapRedraw);
    map.on("zoom", requestHeatmapRedraw);
    map.on("viewreset", requestHeatmapRedraw);
    map.on("resize", requestHeatmapRedraw);

    // Initial draw
    requestHeatmapRedraw();

    return () => {
      map.off("move", requestHeatmapRedraw);
      map.off("zoom", requestHeatmapRedraw);
      map.off("viewreset", requestHeatmapRedraw);
      map.off("resize", requestHeatmapRedraw);
    };
  }, [requestHeatmapRedraw]);

  // Reactive Satellite & Ortho Tile Layer Handler
  useEffect(() => {
    const map = mapInstanceRef.current;
    const copernicus = copernicusLayerRef.current;
    const highres = highresLayerRef.current;
    const labels = labelsLayerRef.current;

    if (!map || !copernicus || !highres || !labels) return;

    const activeTileLayer = satelliteVariant === "sentinel2" ? copernicus : highres;
    const inactiveTileLayer = satelliteVariant === "sentinel2" ? highres : copernicus;

    if (map.hasLayer(inactiveTileLayer)) {
      map.removeLayer(inactiveTileLayer);
    }

    if (isSatelliteActive) {
      if (!map.hasLayer(activeTileLayer)) {
        activeTileLayer.addTo(map);
      }
      activeTileLayer.setOpacity(satelliteOpacity / 100);

      if (showCoastalLabels) {
        if (!map.hasLayer(labels)) {
          labels.addTo(map);
        }
        labels.setOpacity(0.92);
      } else {
        if (map.hasLayer(labels)) {
          map.removeLayer(labels);
        }
      }
    } else {
      if (map.hasLayer(copernicus)) map.removeLayer(copernicus);
      if (map.hasLayer(highres)) map.removeLayer(highres);
      if (map.hasLayer(labels)) map.removeLayer(labels);
    }
  }, [isSatelliteActive, satelliteVariant, satelliteOpacity, showCoastalLabels]);

  // Selected or primary transect ground truth observation from Copernicus
  const activeGroundTransect = useMemo(() => {
    if (selectedTransect) return selectedTransect;
    if (criticalHotspots.length > 0) return criticalHotspots[0];
    return transects[0] || null;
  }, [selectedTransect, criticalHotspots, transects]);

  const copernicusObservation = useMemo(() => {
    if (!activeGroundTransect) return null;
    return getCopernicusGroundObservation(activeGroundTransect);
  }, [activeGroundTransect]);

  // Update coastal transect markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();
    markersRef.current = {};

    transects.forEach((t) => {
      const validCoords = parseValidLatLng(t.coordinates);
      if (!validCoords) return;

      const score = getSusceptibilityScore(t);
      const scoreColor = getSusceptibilityColor(score);
      const tier = getSusceptibilityTier(score);
      const isSelected = selectedTransect?.id === t.id;
      const isCritical = score >= 75 || (activeAlert && activeAlert.affected_transect_ids.includes(t.id));

      let markerHtml: string;
      let iconSize: [number, number];
      let iconAnchor: [number, number];

      if (isHeatmapActive) {
        const pinSize = isSelected ? 38 : (showScoreBadges ? 32 : 24);
        iconSize = [pinSize, pinSize];
        iconAnchor = [pinSize / 2, pinSize / 2];

        markerHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${pinSize}px;
            height: ${pinSize}px;
            background: ${scoreColor};
            border: ${isSelected ? "3px solid #38bdf8" : "2.5px solid #0f172a"};
            border-radius: 50%;
            box-shadow: 0 0 ${isSelected ? "22px #38bdf8" : isCritical ? "16px " + scoreColor : "8px " + scoreColor + "99"}, 
                        inset 0 0 6px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          ">
            ${isCritical ? `
              <div style="
                position: absolute;
                inset: -6px;
                border-radius: 50%;
                border: 2px solid ${scoreColor};
                opacity: 0.8;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                pointer-events: none;
              "></div>
            ` : ""}
            ${showScoreBadges ? `
              <span style="
                font-family: ui-monospace, SFMono-Regular, monospace;
                font-size: ${isSelected ? "11px" : "10px"};
                font-weight: 800;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0,0,0,0.8);
                line-height: 1;
              ">${Math.round(score)}%</span>
            ` : `
              <div style="
                width: ${isSelected ? "10px" : "6px"};
                height: ${isSelected ? "10px" : "6px"};
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 2px rgba(0,0,0,0.5);
              "></div>
            `}
          </div>
        `;
      } else {
        const pinSize = isSelected ? 34 : 26;
        iconSize = [pinSize, pinSize];
        iconAnchor = [pinSize / 2, pinSize / 2];

        markerHtml = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${pinSize}px;
            height: ${pinSize}px;
            background: ${
              t.risk_class === "Very High" ? "#f43f5e" :
              t.risk_class === "High" ? "#f97316" :
              t.risk_class === "Medium" ? "#f59e0b" : "#10b981"
            };
            border: ${isSelected ? "3px solid #38bdf8" : "2px solid #ffffff"};
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
            cursor: pointer;
          ">
            <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: "custom-transect-pin",
        html: markerHtml,
        iconSize,
        iconAnchor
      });

      const marker = L.marker(validCoords, { icon: customIcon });

      marker.on("click", () => {
        onSelectTransect(t);
        setSelectedEvacRouteId(`EVAC-${t.id}`);
      });

      marker.bindTooltip(
        `<div style="font-family: ui-sans-serif, system-ui; text-align: left; padding: 2px 4px;">
          <div style="font-weight: bold; font-size: 11px; color: #0f172a;">${t.id}: ${t.name}</div>
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${scoreColor};"></span>
            <span style="font-size: 10px; font-weight: 600; color: #334155;">
              ${tier.label} (${score.toFixed(1)}%)
            </span>
          </div>
          <div style="font-size: 9px; font-family: monospace; color: #64748b; margin-top: 1px;">
            Retreat: ${t.historical_trend}
          </div>
        </div>`,
        { direction: "top", offset: [0, -14], opacity: 0.98 }
      );

      marker.addTo(layerGroupRef.current!);
      markersRef.current[t.id] = marker;
    });

    requestHeatmapRedraw();
  }, [transects, selectedTransect, isHeatmapActive, showScoreBadges, requestHeatmapRedraw, onSelectTransect, activeAlert]);

  // Evacuation Routes & Safe Zones Layer Rendering Effect
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!evacuationLayerGroupRef.current) {
      evacuationLayerGroupRef.current = L.layerGroup().addTo(map);
    }
    const evacGroup = evacuationLayerGroupRef.current;
    evacGroup.clearLayers();

    if (!isEvacuationActive) return;

    const routesToDisplay = filterHighRiskOnly ? highRiskEvacRoutes : evacuationRoutes;

    // 1. Draw Coastal Inundation Exclusion Buffer for High-Risk Alert Transects
    const criticalTargets = evacuationRoutes.filter((r) => r.is_high_risk_disaster_target);
    criticalTargets.forEach((route) => {
      const circle = L.circle(route.origin_coordinates, {
        radius: 320,
        color: "#f43f5e",
        weight: 1.8,
        dashArray: "5, 5",
        fillColor: "#f43f5e",
        fillOpacity: 0.16
      });

      circle.bindTooltip(
        `<div style="font-family: ui-sans-serif, system-ui; font-size: 10px; color: #fecdd3; padding: 2px;">
           <strong style="color: #ffffff; text-transform: uppercase;">⚠️ Coastal Exclusion Buffer (300m)</strong><br/>
           ${route.origin_transect_name}<br/>
           <span style="color: #fda4af; font-family: monospace; font-size: 9px;">Mandatory civilian exclusion during surge alert</span>
         </div>`,
        { direction: "bottom", offset: [0, 12], opacity: 0.96 }
      );
      circle.addTo(evacGroup);
    });

    // 2. Draw Evacuation Corridors (Animated Polylines)
    routesToDisplay.forEach((route) => {
      const isSelected = selectedEvacRoute?.id === route.id;
      const isUrgent = route.is_high_risk_disaster_target;

      const polyline = L.polyline(route.path_coordinates, {
        color: isSelected ? "#38bdf8" : isUrgent ? "#f43f5e" : "#10b981",
        weight: isSelected ? 5.5 : isUrgent ? 4 : 3,
        opacity: isSelected ? 1 : 0.88,
        className: isSelected
          ? "evac-route-poly-selected"
          : isUrgent
          ? "evac-route-poly-urgent"
          : "evac-route-poly-active"
      });

      polyline.on("click", () => {
        setSelectedEvacRouteId(route.id);
        const matchTransect = transects.find((t) => t.id === route.origin_transect_id);
        if (matchTransect) {
          onSelectTransect(matchTransect);
        }
      });

      polyline.bindTooltip(
        `<div style="padding: 4px 6px; font-family: ui-sans-serif, system-ui; text-align: left; min-width: 170px;">
           <div style="font-weight: 800; font-size: 10px; text-transform: uppercase; color: ${isUrgent ? "#f43f5e" : "#10b981"}; display: flex; align-items: center; gap: 4px;">
             <span>${isUrgent ? "🚨 MANDATORY EVACUATION PATH" : "SAFE INLAND CORRIDOR"}</span>
           </div>
           <div style="font-weight: 700; font-size: 11px; color: #0f172a; margin-top: 1px;">
             ${route.origin_transect_name.split("-")[0].trim()} ➔ ${route.safe_zone.name}
           </div>
           <div style="font-family: ui-monospace, monospace; font-size: 9px; color: #475569; margin-top: 2px;">
             ${route.distance_meters}m • ~${route.est_walk_minutes} min walk • +${route.elevation_gain_m}m climb
           </div>
           <div style="font-size: 9px; color: #0369a1; font-weight: 600; margin-top: 2px;">
             Click to inspect full corridor waypoints
           </div>
         </div>`,
        { sticky: true, opacity: 0.98 }
      );

      polyline.addTo(evacGroup);

      // Draw waypoints / junction nodes along the path
      route.waypoints.forEach((wp, wpIdx) => {
        if (wpIdx > 0 && wpIdx < route.waypoints.length - 1) {
          const wpMarker = L.circleMarker(wp.coordinates, {
            radius: isSelected ? 4.5 : 3.5,
            color: isSelected ? "#38bdf8" : isUrgent ? "#f43f5e" : "#10b981",
            fillColor: "#0f172a",
            fillOpacity: 1,
            weight: 2
          });

          wpMarker.bindTooltip(
            `<div style="font-family: ui-sans-serif, system-ui; font-size: 10px; color: #f8fafc;">
               <strong>${wp.name}</strong> (+${wp.elevation_m}m ASL)<br/>
               <span style="color: #94a3b8; font-size: 9px;">${wp.instruction}</span>
             </div>`,
            { direction: "top", offset: [0, -6], opacity: 0.96 }
          );

          wpMarker.addTo(evacGroup);
        }
      });
    });

    // 3. Draw Safe Zone Assembly Markers
    const safeZones = getUniqueSafeZones(routesToDisplay);
    safeZones.forEach((sz) => {
      const isConnectedToSelected = selectedEvacRoute?.safe_zone.id === sz.id;
      const size = isConnectedToSelected ? 44 : 36;

      const safeZoneIcon = L.divIcon({
        className: "safe-zone-marker-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            border: ${isConnectedToSelected ? "3px solid #38bdf8" : "2.5px solid #ecfdf5"};
            border-radius: 10px;
            box-shadow: 0 0 ${isConnectedToSelected ? "22px #38bdf8" : "14px rgba(16, 185, 129, 0.7)"}, 0 4px 6px -1px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          ">
            <div style="
              position: absolute;
              inset: -5px;
              border-radius: 14px;
              border: 2px solid #10b981;
              opacity: 0.55;
              animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
              pointer-events: none;
            "></div>

            <svg width="${size * 0.52}" height="${size * 0.52}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>

            <div style="
              position: absolute;
              bottom: -9px;
              background: #0f172a;
              color: #34d399;
              font-family: ui-monospace, SFMono-Regular, monospace;
              font-size: 9px;
              font-weight: 800;
              padding: 1px 5px;
              border-radius: 4px;
              border: 1px solid #059669;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            ">+${Math.round(sz.elevation_m)}m</div>
          </div>
        `
      });

      const marker = L.marker(sz.coordinates, { icon: safeZoneIcon });
      const occupancyPct = Math.round((sz.current_occupancy / sz.capacity_people) * 100);

      marker.bindPopup(`
        <div style="font-family: ui-sans-serif, system-ui; width: 260px; color: #0f172a; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
              CIVIC SAFE REFUGE
            </span>
            <span style="font-family: ui-monospace, monospace; font-size: 11px; font-weight: 800; color: #059669;">
              +${sz.elevation_m}m ASL (SURGE SAFE)
            </span>
          </div>

          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 3px; line-height: 1.2;">
            ${sz.name}
          </div>

          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            ${sz.type} • Road: <strong>${sz.primary_access_road}</strong>
          </div>

          <div style="background: #f1f5f9; padding: 6px; border-radius: 6px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; font-family: ui-monospace, monospace; margin-bottom: 3px;">
              <span style="color: #64748b;">Shelter Capacity:</span>
              <strong style="color: #0f172a;">${sz.current_occupancy.toLocaleString()} / ${sz.capacity_people.toLocaleString()} (${occupancyPct}%)</strong>
            </div>
            <div style="height: 5px; background: #cbd5e1; border-radius: 3px; overflow: hidden;">
              <div style="width: ${occupancyPct}%; height: 100%; background: #10b981;"></div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 10px; margin-bottom: 8px;">
            <div style="background: #f8fafc; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; display: block; font-size: 9px;">Medical:</span>
              <strong style="color: #0f172a;">${sz.medical_support}</strong>
            </div>
            <div style="background: #f8fafc; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; display: block; font-size: 9px;">Radio Comms:</span>
              <strong style="color: #0f172a; font-family: monospace;">${sz.contact_vhf_channel}</strong>
            </div>
          </div>

          <div style="font-size: 9px; color: #64748b; line-height: 1.3;">
            Amenities: ${sz.amenities.slice(0, 3).join(", ")}
          </div>
        </div>
      `, { maxWidth: 280 });

      marker.on("click", () => {
        const matchedRoute = routesToDisplay.find((r) => r.safe_zone.id === sz.id);
        if (matchedRoute) {
          setSelectedEvacRouteId(matchedRoute.id);
        }
      });

      marker.addTo(evacGroup);
    });

  }, [isEvacuationActive, evacuationRoutes, highRiskEvacRoutes, selectedEvacRoute, filterHighRiskOnly, transects, onSelectTransect]);

  // Pan smoothly to selected transect or fit evacuation route
  useEffect(() => {
    if (selectedTransect && mapInstanceRef.current && !selectedEvacRouteId) {
      const validCoords = parseValidLatLng(selectedTransect.coordinates);
      if (validCoords) {
        mapInstanceRef.current.flyTo(validCoords, 11, {
          duration: 1.2
        });
      }
    }
  }, [selectedTransect, selectedEvacRouteId]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    mapInstanceRef.current?.flyTo([42.25, 14.5], 9, { duration: 1.0 });
  };

  const handleFocusHotspot = (hotspot: CoastalTransect) => {
    onSelectTransect(hotspot);
    setSelectedEvacRouteId(`EVAC-${hotspot.id}`);
    const validCoords = parseValidLatLng(hotspot.coordinates);
    if (validCoords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(validCoords, 12, { duration: 1.2 });
    }
  };

  const handleFocusEvacRoute = (route: EvacuationRoute) => {
    setSelectedEvacRouteId(route.id);
    const matchTransect = transects.find((t) => t.id === route.origin_transect_id);
    if (matchTransect) {
      onSelectTransect(matchTransect);
    }
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(route.path_coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 select-none">
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-0" />

      {/* Top Left: Map Header Floating Overlay, Alert & Evacuation Corridors Bar */}
      <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-auto max-w-[calc(100%-160px)] sm:max-w-md">
        {/* Main Status Badge */}
        <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-xl transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                isEvacuationActive ? "bg-emerald-400 animate-ping" : isHeatmapActive ? "bg-rose-500 animate-ping" : "bg-cyan-400"
              }`} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={isEvacuationActive ? "title-evac" : "title-map"}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.16 }}
                  className="text-xs font-bold text-slate-100"
                >
                  {isEvacuationActive ? "Emergency Evacuation Routes & Safe Havens" : "Geospatial Erosion Risk Map"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Mode Tag */}
            <AnimatePresence>
              {isEvacuationActive && (
                <motion.span
                  key="evac-active-pill"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold"
                >
                  CIVIL DEFENSE ACTIVE
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
            <span>{transects.length} Transects</span>
            <span>&bull;</span>
            <span>Avg Risk: <strong className="text-cyan-300 font-mono">{avgSusceptibility}%</strong></span>
            {isEvacuationActive && (
              <>
                <span>&bull;</span>
                <span className="text-emerald-300 font-semibold font-mono">
                  {highRiskEvacRoutes.length} Threatened Corridors
                </span>
              </>
            )}
          </div>

          {/* Active Status Badges */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
            <AnimatePresence>
              {isSatelliteActive && (
                <motion.span
                  key="badge-sat"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold"
                >
                  <Satellite className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>Copernicus Sentinel-2 ({satelliteVariant === "sentinel2" ? "10m MSI Cloudless" : "High-Res Ortho"}, {satelliteOpacity}%)</span>
                </motion.span>
              )}

              {isEvacuationActive && (
                <motion.span
                  key="badge-evac"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Safe Zones: {networkSummary.totalSafeZones} Hubs (+{networkSummary.highestElevationSafeZoneM}m max)</span>
                </motion.span>
              )}

              {isHeatmapActive && (
                <motion.span
                  key="badge-heat"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-semibold"
                >
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Heatmap Active ({criticalHotspots.length} hotspots)</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Evacuation Routes Quick Selection Strip with Smooth Collapse/Expand */}
        <AnimatePresence>
          {isEvacuationActive && highRiskEvacRoutes.length > 0 && (
            <motion.div
              key="evac-corridors-strip"
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-900/50 shadow-lg flex flex-col gap-1.5 overflow-hidden"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Threatened Evacuation Corridors:</span>
                </span>
                <button
                  onClick={() => setFilterHighRiskOnly(!filterHighRiskOnly)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-[9px] underline cursor-pointer"
                >
                  {filterHighRiskOnly ? "Show All Routes" : "High-Risk Only"}
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {highRiskEvacRoutes.map((route) => {
                  const isCurrent = selectedEvacRoute?.id === route.id;
                  return (
                    <button
                      key={route.id}
                      id={`btn-evac-corridor-${route.id}`}
                      onClick={() => handleFocusEvacRoute(route)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-md ring-2 ring-cyan-400"
                          : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/40"
                      }`}
                      title={`${route.corridor_name} (${route.distance_meters}m to ${route.safe_zone.name})`}
                    >
                      <Route className={`w-3 h-3 ${isCurrent ? "text-slate-950" : "text-emerald-400"}`} />
                      <span>{route.origin_transect_id}</span>
                      <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      <span className="truncate max-w-[90px]">{route.safe_zone.name.split(" ")[0]}</span>
                      <span className={`px-1 py-0.2 rounded text-[9px] ${isCurrent ? "bg-slate-900 text-emerald-300" : "bg-emerald-900 text-emerald-300"}`}>
                        +{Math.round(route.safe_zone.elevation_m)}m
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hotspot Quick Jump Bar (when Heatmap active & Evacuation not overriding) */}
        <AnimatePresence>
          {!isEvacuationActive && isHeatmapActive && criticalHotspots.length > 0 && (
            <motion.div
              key="hotspots-strip"
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-950/40 shadow-lg flex items-center gap-1.5 flex-wrap overflow-hidden"
            >
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Hotspots:</span>
              </span>
              <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-[420px] scrollbar-none py-0.5">
                {criticalHotspots.slice(0, 5).map((hotspot) => {
                  const score = getSusceptibilityScore(hotspot);
                  const isCurrent = selectedTransect?.id === hotspot.id;
                  return (
                    <button
                      key={hotspot.id}
                      id={`btn-hotspot-${hotspot.id}`}
                      onClick={() => handleFocusHotspot(hotspot)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                        isCurrent
                          ? "bg-rose-500 text-white shadow-sm ring-1 ring-white/50"
                          : "bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40"
                      }`}
                      title={`${hotspot.name}: ${score.toFixed(1)}% Susceptibility`}
                    >
                      <span>{hotspot.id}</span>
                      <span className="opacity-90">{Math.round(score)}%</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Copernicus Ground Cross-Reference HUD with AnimatePresence on Transect Change */}
        <AnimatePresence mode="wait">
          {isSatelliteActive && showGroundCrossReference && copernicusObservation && (
            <motion.div
              key={`copernicus-hud-${copernicusObservation.transect_id}`}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-900/95 backdrop-blur-md rounded-xl border border-cyan-500/40 shadow-2xl p-2.5 text-slate-200 pointer-events-auto max-w-full"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <ScanEye className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                        Copernicus Ground Truth
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[8px] font-bold font-mono bg-blue-500/30 text-blue-200">
                        {copernicusObservation.transect_id}
                      </span>
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-100 line-clamp-1">
                      {copernicusObservation.coastal_classification}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsGroundInspectorMinimized(!isGroundInspectorMinimized); }}
                    className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
                    title={isGroundInspectorMinimized ? "Expand Ground HUD" : "Minimize Ground HUD"}
                  >
                    {isGroundInspectorMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowGroundCrossReference(false); }}
                    className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
                    title="Hide Ground HUD"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {!isGroundInspectorMinimized ? (
                <div className="space-y-1.5 text-[10px]">
                  {/* Morphology & Verification */}
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mb-0.5">
                      <span className="line-clamp-1">Morphology: {copernicusObservation.shoreline_morphology}</span>
                      <span className="text-cyan-300 font-bold shrink-0 ml-1">{copernicusObservation.satellite_verification_level}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-snug">
                      {copernicusObservation.ground_truth_cross_reference}
                    </p>
                  </div>

                  {/* Visible Features Pills */}
                  <div className="flex flex-wrap gap-1">
                    {copernicusObservation.visible_satellite_features.slice(0, 3).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[9px] text-slate-300 line-clamp-1"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Spectral Telemetry */}
                  <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] pt-0.5">
                    <div className="bg-slate-800/60 p-1 rounded border border-slate-700/40">
                      <span className="text-slate-400 block text-[8px]">NDWI Water</span>
                      <span className="font-bold text-cyan-300">+{copernicusObservation.moisture_water_ndwi.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-800/60 p-1 rounded border border-slate-700/40">
                      <span className="text-slate-400 block text-[8px]">NDVI Veget.</span>
                      <span className="font-bold text-emerald-300">{copernicusObservation.vegetation_health_ndvi.toFixed(2)}</span>
                    </div>
                    <div className="bg-slate-800/60 p-1 rounded border border-slate-700/40 truncate">
                      <span className="text-slate-400 block text-[8px]">Sediment Plume</span>
                      <span className="font-bold text-amber-300 truncate">
                        {copernicusObservation.turbidity_sediment_plume.split("/")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span className="line-clamp-1">{copernicusObservation.shoreline_morphology}</span>
                  <span className="text-cyan-400 font-bold shrink-0 ml-1">10m GSD MSI</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right: Layer Toggles & Map Navigation Controls */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 items-end pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-xl flex-wrap justify-end">
          
          {/* Copernicus Satellite Layer Toggle Button */}
          <button
            id="btn-toggle-satellite-layer"
            onClick={handleToggleSatellite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isSatelliteActive
                ? "bg-gradient-to-r from-blue-600/25 to-cyan-500/25 text-cyan-200 border border-cyan-500/50 shadow-cyan-950/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
            title="Toggle real-time Copernicus Sentinel-2 satellite imagery layer"
          >
            <Satellite className={`w-3.5 h-3.5 transition-colors ${isSatelliteActive ? "text-cyan-400 animate-pulse" : "text-slate-400"}`} />
            <span>Copernicus Sat</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-black ${
              isSatelliteActive ? "bg-cyan-400 text-slate-950" : "bg-slate-700 text-slate-300"
            }`}>
              {isSatelliteActive ? "ON" : "OFF"}
            </span>
          </button>

          {/* Satellite Settings Popover Toggle */}
          {isSatelliteActive && (
            <button
              id="btn-toggle-satellite-settings"
              onClick={() => {
                setShowSatelliteSettings(!showSatelliteSettings);
                if (showSettingsPopover) setShowSettingsPopover(false);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                showSatelliteSettings
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60"
              }`}
              title="Tune Satellite Opacity, Imagery Stream & Ground HUD"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Evacuation Routes Layer Toggle Button */}
          <button
            id="btn-toggle-evacuation-layer"
            onClick={handleToggleEvacuation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isEvacuationActive
                ? "bg-gradient-to-r from-emerald-500/25 to-teal-500/25 text-emerald-200 border border-emerald-500/50 shadow-emerald-950/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
            title="Toggle Evacuation Routes & Safe Zones overlay on the map"
          >
            <ShieldCheck className={`w-3.5 h-3.5 transition-colors ${isEvacuationActive ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
            <span>Evac Routes</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-black ${
              isEvacuationActive ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300"
            }`}>
              {isEvacuationActive ? "ON" : "OFF"}
            </span>
          </button>

          {/* Toggleable Heatmap Layer Control */}
          <button
            id="btn-toggle-heatmap-layer"
            onClick={handleToggleHeatmap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isHeatmapActive
                ? "bg-gradient-to-r from-rose-500/25 to-orange-500/25 text-rose-200 border border-rose-500/50 shadow-rose-950/40"
                : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
            }`}
            title="Toggle erosion susceptibility continuous heatmap layer"
          >
            <Flame className={`w-3.5 h-3.5 transition-colors ${isHeatmapActive ? "text-rose-400 fill-rose-400 animate-pulse" : "text-slate-400"}`} />
            <span>Heatmap</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-black ${
              isHeatmapActive ? "bg-rose-500 text-white" : "bg-slate-700 text-slate-300"
            }`}>
              {isHeatmapActive ? "ON" : "OFF"}
            </span>
          </button>

          {/* Heatmap Settings Popover Toggle */}
          {isHeatmapActive && (
            <button
              id="btn-toggle-heatmap-settings"
              onClick={() => {
                setShowSettingsPopover(!showSettingsPopover);
                if (showSatelliteSettings) setShowSatelliteSettings(false);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                showSettingsPopover
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  : "bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60"
              }`}
              title="Tune Heatmap Opacity, Radius & Shading"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Copernicus Satellite Tuning Popover */}
        <AnimatePresence>
          {isSatelliteActive && showSatelliteSettings && (
            <motion.div
              key="satellite-tuning-popover"
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-72 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-800 p-3 shadow-2xl flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                  Copernicus Satellite Settings
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSatelliteSettings(false); }}
                  className="text-[10px] text-slate-400 hover:text-slate-200 font-mono cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Satellite Stream Variant */}
              <div>
                <span className="text-slate-400 text-[11px] block mb-1">Optical Satellite Feed:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSatelliteVariant("sentinel2")}
                    className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all cursor-pointer text-left ${
                      satelliteVariant === "sentinel2"
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-bold">Sentinel-2 10m</div>
                    <div className="text-[9px] opacity-80">ESA Cloudless MSI</div>
                  </button>
                  <button
                    onClick={() => setSatelliteVariant("highres")}
                    className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all cursor-pointer text-left ${
                      satelliteVariant === "highres"
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-bold">Sub-Meter Ortho</div>
                    <div className="text-[9px] opacity-80">High-Res Detail</div>
                  </button>
                </div>
              </div>

              {/* Opacity Setting */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Satellite Ground Opacity:</span>
                  <span className="font-mono text-cyan-300 font-bold">{satelliteOpacity}%</span>
                </div>
                <div className="flex gap-1.5">
                  {[40, 75, 100].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSatelliteOpacity(val)}
                      className={`flex-1 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                        satelliteOpacity === val
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Labels & Inspector Toggles */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setShowCoastalLabels(!showCoastalLabels)}
                  className={`flex-1 py-1 px-2 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                    showCoastalLabels
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  Labels: {showCoastalLabels ? "Visible" : "Hidden"}
                </button>

                <button
                  onClick={() => setShowGroundCrossReference(!showGroundCrossReference)}
                  className={`flex-1 py-1 px-2 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                    showGroundCrossReference
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  Ground HUD: {showGroundCrossReference ? "ON" : "OFF"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heatmap Tuning Popover */}
        <AnimatePresence>
          {isHeatmapActive && showSettingsPopover && (
            <motion.div
              key="heatmap-tuning-popover"
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-64 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-800 p-3 shadow-2xl flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  Heatmap Parameters
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSettingsPopover(false); }}
                  className="text-[10px] text-slate-400 hover:text-slate-200 font-mono cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Opacity Setting */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Layer Opacity:</span>
                  <span className="font-mono text-cyan-300 font-bold">{heatmapOpacity}%</span>
                </div>
                <div className="flex gap-1.5">
                  {[50, 75, 90].map((val) => (
                    <button
                      key={val}
                      onClick={() => setHeatmapOpacity(val)}
                      className={`flex-1 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                        heatmapOpacity === val
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius Setting */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Thermal Blur Radius:</span>
                  <span className="font-mono text-cyan-300 font-bold">{heatmapRadius}px</span>
                </div>
                <div className="flex gap-1.5">
                  {[
                    { label: "Tight", val: 40 },
                    { label: "Balanced", val: 55 },
                    { label: "Broad", val: 75 }
                  ].map((item) => (
                    <button
                      key={item.val}
                      onClick={() => setHeatmapRadius(item.val)}
                      className={`flex-1 py-1 rounded text-[10px] transition-all cursor-pointer ${
                        heatmapRadius === item.val
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Score Badges Toggle */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Show % on Pins:</span>
                <button
                  onClick={() => setShowScoreBadges(!showScoreBadges)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    showScoreBadges ? "bg-rose-500 text-white font-bold" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {showScoreBadges ? "Enabled" : "Dots Only"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation & Zoom Controls */}
        <div className="flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
          <button
            id="btn-map-zoom-in"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-map-zoom-out"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            id="btn-map-reset"
            onClick={handleResetView}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Reset Extent"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Floating Evacuation Route Inspector Card (When Evacuation Active) */}
      <AnimatePresence mode="wait">
        {isEvacuationActive && selectedEvacRoute && (
          <motion.div
            key={`evac-inspector-${selectedEvacRoute.id}`}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-4 right-4 z-50 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-emerald-500/40 shadow-2xl p-3.5 text-slate-200 pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${selectedEvacRoute.is_high_risk_disaster_target ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"}`}>
                  <Route className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                      {selectedEvacRoute.id}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono uppercase ${
                      selectedEvacRoute.is_high_risk_disaster_target
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-emerald-500/30 text-emerald-200"
                    }`}>
                      {selectedEvacRoute.evacuation_status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                    {selectedEvacRoute.corridor_name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsEvacInspectorMinimized(!isEvacInspectorMinimized); }}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
                  title={isEvacInspectorMinimized ? "Expand Details" : "Minimize"}
                >
                  {isEvacInspectorMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedEvacRouteId(null); }}
                  className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {!isEvacInspectorMinimized ? (
              <div className="space-y-2.5 text-xs">
                {/* Origin -> Safe Destination Banner */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Coastal Origin (Danger):</span>
                    <strong className="text-slate-200 text-xs line-clamp-1">{selectedEvacRoute.origin_transect_name.split("-")[0].trim()}</strong>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      Risk: {selectedEvacRoute.origin_risk_score.toFixed(1)}%
                    </span>
                  </div>

                  <div className="border-l border-slate-800 pl-2">
                    <span className="text-[10px] text-slate-400 block font-mono">Designated Safe Haven:</span>
                    <strong className="text-emerald-300 text-xs line-clamp-1">{selectedEvacRoute.safe_zone.name}</strong>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Mountain className="w-3 h-3 text-emerald-400" />
                      +{Math.round(selectedEvacRoute.safe_zone.elevation_m)}m ASL Safe
                    </span>
                  </div>
                </div>

                {/* Transit Metrics Grid */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block">Distance</span>
                    <span className="font-mono text-xs font-bold text-cyan-300">{selectedEvacRoute.distance_meters}m</span>
                  </div>
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block flex items-center justify-center gap-0.5">
                      <Footprints className="w-2.5 h-2.5 text-amber-300" /> Walk Time
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">~{selectedEvacRoute.est_walk_minutes} min</span>
                  </div>
                  <div className="bg-slate-800/60 p-1.5 rounded-lg border border-slate-700/50">
                    <span className="text-[9px] text-slate-400 block flex items-center justify-center gap-0.5">
                      <Car className="w-2.5 h-2.5 text-emerald-300" /> Vehicle
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-300">~{selectedEvacRoute.est_vehicle_minutes} min</span>
                  </div>
                </div>

                {/* Step-by-step Action Guidance */}
                <div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Corridor Action Steps:
                  </span>
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {selectedEvacRoute.action_steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-tight">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => handleFocusEvacRoute(selectedEvacRoute)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Focus Route Bounds</span>
                  </button>

                  {onOpenDisasterCenter && (
                    <button
                      onClick={onOpenDisasterCenter}
                      className="py-1.5 px-2.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Open 3-Day Disaster Early Warning Center"
                    >
                      <Radio className="w-3 h-3 text-rose-400" />
                      <span>CAP Alert</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{selectedEvacRoute.distance_meters}m • ~{selectedEvacRoute.est_walk_minutes} min walk</span>
                <button
                  onClick={() => handleFocusEvacRoute(selectedEvacRoute)}
                  className="text-cyan-400 font-mono text-[10px] hover:underline cursor-pointer"
                >
                  Focus Corridor
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Left: Dynamic Legend (Supports Satellite, Evacuation, and Heatmap Modes) */}
      <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-xl pointer-events-auto max-w-[calc(100%-32px)] sm:max-w-md">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {activeLegendTab === "satellite" ? (
              <>
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  Copernicus Ground Truth Optical Key
                </span>
              </>
            ) : activeLegendTab === "evacuation" ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  Evacuation Corridors & Safe Zones
                </span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  Erosion Susceptibility Score Heatmap
                </span>
              </>
            )}
          </div>

          {/* View Toggles & Tab Switcher */}
          <div className="flex items-center gap-1">
            {isSatelliteActive && (
              <button
                onClick={() => setActiveLegendTab("satellite")}
                className={`text-[9px] font-mono cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                  activeLegendTab === "satellite"
                    ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Satellite
              </button>
            )}

            {isEvacuationActive && (
              <button
                onClick={() => setActiveLegendTab("evacuation")}
                className={`text-[9px] font-mono cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                  activeLegendTab === "evacuation"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Evac
              </button>
            )}

            {isHeatmapActive && (
              <button
                onClick={() => setActiveLegendTab("gradient")}
                className={`text-[9px] font-mono cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                  activeLegendTab === "gradient" || activeLegendTab === "categories"
                    ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Thermal
              </button>
            )}

            {(activeLegendTab === "gradient" || activeLegendTab === "categories") && isHeatmapActive && (
              <button
                onClick={() => setActiveLegendTab(activeLegendTab === "gradient" ? "categories" : "gradient")}
                className="text-[9px] text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer ml-1"
              >
                {activeLegendTab === "gradient" ? "Tiers" : "Grad"}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`legend-content-${activeLegendTab}-${isHeatmapActive}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {activeLegendTab === "satellite" ? (
              /* Copernicus Sentinel-2 Satellite Optical Reflectance Key */
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#1b3d54] border border-blue-400/40 shrink-0" />
                    <span className="text-slate-300 truncate">Deep Adriatic</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#388e8e] border border-teal-300/40 shrink-0" />
                    <span className="text-slate-300 truncate">Sediment Plume</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#d4b27b] border border-amber-300/40 shrink-0" />
                    <span className="text-slate-300 truncate">Exposed Sand/Berm</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#2e5e34] border border-emerald-400/40 shrink-0" />
                    <span className="text-slate-300 truncate">Dune Vegetation</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#9c7849] border border-orange-300/40 shrink-0" />
                    <span className="text-slate-300 truncate">Active Cliff Scarp</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#64748b] border border-slate-400/40 shrink-0" />
                    <span className="text-slate-300 truncate">Breakwaters/Jetties</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>ESA Copernicus Sentinel-2 MSI • Level-2A BOA</span>
                  <span className="text-cyan-300 font-bold">10m GSD True Color</span>
                </div>
              </div>
            ) : activeLegendTab === "evacuation" ? (
              /* Evacuation Overlay Legend */
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <div className="w-3.5 h-3.5 rounded bg-emerald-600 flex items-center justify-center text-white shrink-0">
                      <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-slate-300">Designated Safe Haven</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <div className="w-4 h-1 rounded bg-rose-500 shrink-0 shadow-sm" />
                    <span className="text-rose-300 font-semibold">Mandatory Urgent Path</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <div className="w-4 h-1 rounded bg-emerald-500 shrink-0" />
                    <span className="text-slate-300">Safe Clearance Path</span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1 rounded border border-slate-700/60">
                    <div className="w-3 h-3 rounded-full border border-dashed border-rose-500 bg-rose-500/20 shrink-0" />
                    <span className="text-slate-400">Coastal Inundation Zone</span>
                  </div>
                </div>
              </div>
            ) : isHeatmapActive ? (
              /* Heatmap Gradient or Tiers */
              activeLegendTab === "gradient" ? (
                <div>
                  <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-teal-500 via-amber-400 via-orange-500 to-rose-600 shadow-inner" />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                    <span className="text-teal-400">0% Stable</span>
                    <span className="text-amber-400">35%</span>
                    <span className="text-orange-400">55%</span>
                    <span className="text-rose-400 font-bold">75%+ Hotspot</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {SUSCEPTIBILITY_TIERS.map((tier) => {
                    const count = transects.filter((t) => {
                      const s = getSusceptibilityScore(t);
                      return s >= tier.minScore && (tier.maxScore === 100 ? s <= tier.maxScore : s < tier.maxScore);
                    }).length;
                    return (
                      <div 
                        key={tier.label}
                        className="px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-[10px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                          <span className="text-slate-300 font-medium">{tier.label}</span>
                        </div>
                        <span className="font-mono text-slate-400 font-bold">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Standard Discrete Legend */
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Risk Classification
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">Low</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-slate-300">Med</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-slate-300">High</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-300">Very High</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
