import L from "leaflet";
import { CoastalTransect, RiskLevel } from "../types";

export interface HeatmapRenderOptions {
  radius: number; // Base radius in pixels (e.g. 50)
  opacity: number; // Opacity 0 to 100 (e.g. 75)
  blur: number; // Blur intensity multiplier
}

export interface SusceptibilityTier {
  label: RiskLevel;
  minScore: number;
  maxScore: number;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  description: string;
}

export const SUSCEPTIBILITY_TIERS: SusceptibilityTier[] = [
  {
    label: "Low",
    minScore: 0,
    maxScore: 35,
    color: "#10b981", // Emerald
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeBorder: "rgba(16, 185, 129, 0.4)",
    textColor: "#34d399",
    description: "Stable profile or natural accretion buffer"
  },
  {
    label: "Medium",
    minScore: 35,
    maxScore: 55,
    color: "#eab308", // Amber
    badgeBg: "rgba(234, 179, 8, 0.15)",
    badgeBorder: "rgba(234, 179, 8, 0.4)",
    textColor: "#facc15",
    description: "Moderate seasonal vulnerability & scour"
  },
  {
    label: "High",
    minScore: 55,
    maxScore: 75,
    color: "#f97316", // Orange
    badgeBg: "rgba(249, 115, 22, 0.18)",
    badgeBorder: "rgba(249, 115, 22, 0.4)",
    textColor: "#fb923c",
    description: "Accelerated beach loss & steep profile retreat"
  },
  {
    label: "Very High",
    minScore: 75,
    maxScore: 100,
    color: "#f43f5e", // Rose / Crimson
    badgeBg: "rgba(244, 63, 94, 0.22)",
    badgeBorder: "rgba(244, 63, 94, 0.5)",
    textColor: "#fda4af",
    description: "Critical acute erosion hotspot & asset exposure"
  }
];

/**
 * Safely extracts a normalized erosion susceptibility score (0 to 100) from transect data
 */
export function getSusceptibilityScore(t: CoastalTransect): number {
  if (typeof t.susceptibility_index === "number" && !isNaN(t.susceptibility_index)) {
    return Math.max(0, Math.min(100, t.susceptibility_index));
  }
  if (typeof t.probability === "number" && !isNaN(t.probability)) {
    return Math.max(0, Math.min(100, t.probability * 100));
  }
  switch (t.risk_class) {
    case "Very High":
      return 85.0;
    case "High":
      return 68.0;
    case "Medium":
      return 46.0;
    case "Low":
    default:
      return 22.0;
  }
}

/**
 * Maps an erosion score (0-100) to its corresponding hex color
 */
export function getSusceptibilityColor(score: number): string {
  if (score >= 75) return "#f43f5e"; // Rose
  if (score >= 55) return "#f97316"; // Orange
  if (score >= 35) return "#eab308"; // Amber
  return "#10b981"; // Emerald
}

/**
 * Returns tier metadata based on score
 */
export function getSusceptibilityTier(score: number): SusceptibilityTier {
  if (score >= 75) return SUSCEPTIBILITY_TIERS[3];
  if (score >= 55) return SUSCEPTIBILITY_TIERS[2];
  if (score >= 35) return SUSCEPTIBILITY_TIERS[1];
  return SUSCEPTIBILITY_TIERS[0];
}

/**
 * Pre-computes a 256x4 RGBA lookup palette table for fast color remapping
 */
export function createSusceptibilityPalette(): Uint8ClampedArray {
  const pCanvas = document.createElement("canvas");
  pCanvas.width = 256;
  pCanvas.height = 1;
  const pctx = pCanvas.getContext("2d");
  if (!pctx) return new Uint8ClampedArray(256 * 4);

  const grad = pctx.createLinearGradient(0, 0, 256, 1);
  // Zero threshold is transparent
  grad.addColorStop(0.00, "rgba(6, 182, 212, 0.0)");
  // Low (0-35%): Deep Teal to Emerald
  grad.addColorStop(0.12, "rgba(20, 184, 166, 0.45)");
  grad.addColorStop(0.30, "rgba(16, 185, 129, 0.70)");
  // Moderate (35-55%): Warm Amber / Gold
  grad.addColorStop(0.48, "rgba(234, 179, 8, 0.85)");
  // High (55-75%): Tangerine Orange
  grad.addColorStop(0.68, "rgba(249, 115, 22, 0.92)");
  // Very High (75-100%): Vivid Rose / Crimson Hotspot
  grad.addColorStop(0.85, "rgba(244, 63, 94, 0.98)");
  grad.addColorStop(1.00, "rgba(190, 18, 60, 1.0)");

  pctx.fillStyle = grad;
  pctx.fillRect(0, 0, 256, 1);
  return pctx.getImageData(0, 0, 256, 1).data;
}

let cachedPalette: Uint8ClampedArray | null = null;
function getCachedPalette(): Uint8ClampedArray {
  if (!cachedPalette) {
    cachedPalette = createSusceptibilityPalette();
  }
  return cachedPalette;
}

/**
 * Validates and safely extracts [lat, lng]
 */
export function parseValidLatLng(coords: any): [number, number] | null {
  if (!coords) return null;
  let lat: number | undefined;
  let lng: number | undefined;

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

/**
 * Renders the continuous susceptibility heatmap on an HTML5 canvas overlay
 */
export function renderSusceptibilityHeatmap(
  canvas: HTMLCanvasElement,
  map: L.Map,
  transects: CoastalTransect[],
  options: HeatmapRenderOptions
): void {
  const size = map.getSize();
  if (size.x === 0 || size.y === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetWidth = Math.round(size.x * dpr);
  const targetHeight = Math.round(size.y * dpr);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
  canvas.style.width = `${size.x}px`;
  canvas.style.height = `${size.y}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Offscreen canvas for alpha accumulation at 1x resolution for peak performance
  const offscreen = document.createElement("canvas");
  offscreen.width = size.x;
  offscreen.height = size.y;
  const octx = offscreen.getContext("2d");
  if (!octx) return;

  const zoom = map.getZoom();
  // Scale radius dynamically with zoom level so blur matches geographic scale
  const dynamicRadius = Math.max(
    25,
    Math.min(180, Math.round(options.radius * Math.pow(1.18, zoom - 9) * (options.blur || 1)))
  );

  // Pre-render radial gradient brush
  const brush = document.createElement("canvas");
  const brushDiameter = dynamicRadius * 2;
  brush.width = brushDiameter;
  brush.height = brushDiameter;
  const bctx = brush.getContext("2d");
  if (bctx) {
    const bGrad = bctx.createRadialGradient(
      dynamicRadius, dynamicRadius, 0,
      dynamicRadius, dynamicRadius, dynamicRadius
    );
    bGrad.addColorStop(0.0, "rgba(0,0,0,1)");
    bGrad.addColorStop(0.35, "rgba(0,0,0,0.65)");
    bGrad.addColorStop(0.7, "rgba(0,0,0,0.2)");
    bGrad.addColorStop(1.0, "rgba(0,0,0,0)");
    bctx.fillStyle = bGrad;
    bctx.beginPath();
    bctx.arc(dynamicRadius, dynamicRadius, dynamicRadius, 0, Math.PI * 2);
    bctx.fill();
  }

  // Draw each transect into offscreen alpha accumulation canvas
  transects.forEach((t) => {
    const coords = parseValidLatLng(t.coordinates);
    if (!coords) return;
    const pt = map.latLngToContainerPoint(coords);

    // Viewport bounds checking
    if (
      pt.x < -dynamicRadius ||
      pt.x > size.x + dynamicRadius ||
      pt.y < -dynamicRadius ||
      pt.y > size.y + dynamicRadius
    ) {
      return;
    }

    const score = getSusceptibilityScore(t); // 0 to 100
    // Weight calculation: High scores emit strong, dense radiation; low scores form gentle background
    const normalizedScore = score / 100;
    const alphaWeight = Math.max(0.15, Math.min(1.0, Math.pow(normalizedScore, 1.2)));

    octx.globalAlpha = alphaWeight;
    octx.drawImage(brush, pt.x - dynamicRadius, pt.y - dynamicRadius);
  });

  // Remap alpha to susceptibility color palette
  const imgData = octx.getImageData(0, 0, size.x, size.y);
  const data = imgData.data;
  const palette = getCachedPalette();
  const opacityFactor = Math.max(0.1, Math.min(1.0, options.opacity / 100));

  for (let i = 3; i < data.length; i += 4) {
    const alpha = data[i];
    if (alpha > 0) {
      const pIndex = alpha * 4;
      data[i - 3] = palette[pIndex];     // R
      data[i - 2] = palette[pIndex + 1]; // G
      data[i - 1] = palette[pIndex + 2]; // B
      data[i] = Math.round(palette[pIndex + 3] * (alpha / 255) * opacityFactor);
    }
  }

  // Transfer back to offscreen canvas
  octx.putImageData(imgData, 0, 0);

  // Render to display canvas with high-DPI scaling
  ctx.save();
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.scale(dpr, dpr);
  ctx.drawImage(offscreen, 0, 0);
  ctx.restore();
}

/**
 * Filters transects with susceptibility score above threshold (default 70%)
 */
export function getCriticalHotspots(transects: CoastalTransect[], threshold = 70): CoastalTransect[] {
  return transects.filter((t) => getSusceptibilityScore(t) >= threshold);
}
