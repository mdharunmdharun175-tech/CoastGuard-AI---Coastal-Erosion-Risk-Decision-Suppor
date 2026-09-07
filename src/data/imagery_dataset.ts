import { DatasetImageItem } from "../types";

export const COASTAL_IMAGE_DATASET: DatasetImageItem[] = [
  // Folder 1: Sentinel-2 Multispectral Optical
  {
    id: "IMG-S2-001",
    folder: "01_Sentinel-2_Multispectral",
    filename: "S2B_MSIL2A_20260412_PuntaAderci_NDWI.png",
    title: "Sentinel-2B MSI True Color & Coastal NDWI Waterline",
    location: "Costa dei Trabocchi - Punta Aderci",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.1855, 14.6865],
    captureDate: "2026-04-12 10:42 UTC",
    sensor: "Copernicus Sentinel-2B MSI (Multi-Spectral)",
    resolution: "10m GSD (Ground Sampling Distance)",
    band_composite: "B8 (NIR), B4 (Red), B3 (Green) + NDWI Waterline Mask",
    erosion_hazard_label: "Very High",
    description: "High-resolution multi-spectral optical capture demonstrating 14.2m storm wave backwash and distinct high-water mark (HWM) landward shift along the fragile foredune scarp.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sentinel-2", "Optical", "NDWI", "Waterline", "Dune Scarp"],
    transect_id_ref: "TRX-101"
  },
  {
    id: "IMG-S2-002",
    folder: "01_Sentinel-2_Multispectral",
    filename: "S2A_MSIL2A_20260415_SanVito_SedimentPlume.png",
    title: "Sentinel-2A Coastal Sediment Plume & Turbidity Gradient",
    location: "San Vito Chietino Littoral",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.2980, 14.4440],
    captureDate: "2026-04-15 10:38 UTC",
    sensor: "Copernicus Sentinel-2A MSI",
    resolution: "10m GSD",
    band_composite: "B4 (Red) / B2 (Blue) Suspended Particulate Matter (SPM)",
    erosion_hazard_label: "Medium",
    description: "Longshore sediment transport plume moving south-southeast at 0.42 m/s, capturing cross-shore sediment flushing post-storm surge.",
    image_url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sentinel-2", "Sediment Plume", "Littoral Drift", "SPM"],
    transect_id_ref: "TRX-102"
  },
  {
    id: "IMG-S2-003",
    folder: "01_Sentinel-2_Multispectral",
    filename: "S2B_MSIL2A_20260418_CapeHatteras_Overwash.png",
    title: "Sentinel-2B Barrier Island Overwash Channel Detection",
    location: "Cape Hatteras Outer Banks",
    region: "Atlantic Seaboard (North Carolina, USA)",
    coordinates: [35.2450, -75.5250],
    captureDate: "2026-04-18 15:52 UTC",
    sensor: "Copernicus Sentinel-2B MSI",
    resolution: "10m GSD",
    band_composite: "B12 (SWIR-2), B8A (Narrow NIR), B4 (Red)",
    erosion_hazard_label: "Very High",
    description: "Multi-band SWIR composite highlighting severe overwash fan penetrating 180m across Highway 12 corridor following hurricane surge.",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sentinel-2", "SWIR", "Barrier Island", "Overwash Fan"],
    transect_id_ref: "TRX-108"
  },

  // Folder 2: Sentinel-1 SAR Radar Coherence
  {
    id: "IMG-S1-001",
    folder: "02_Sentinel-1_SAR_Radar",
    filename: "S1A_IW_GRDH_20260414_Ortona_CoherenceSAR.png",
    title: "Sentinel-1A C-SAR Interferometric Coherence Loss Map",
    location: "Ortona Cliff & Headland",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.3550, 14.4020],
    captureDate: "2026-04-14 05:22 UTC",
    sensor: "Copernicus Sentinel-1A C-Band SAR (Synthetic Aperture Radar)",
    resolution: "5m x 20m Spatial Resolution (IW Mode)",
    band_composite: "VV + VH Polarization Dual-Band Ratio (dB Backscatter)",
    erosion_hazard_label: "Very High",
    description: "Radar surface decorrelation highlighting 2.4m rotational cliff slump along the railway escarpment with backscatter drop of -6.8 dB.",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sentinel-1", "SAR Radar", "InSAR Coherence", "Cliff Slump", "C-Band"],
    transect_id_ref: "TRX-104"
  },
  {
    id: "IMG-S1-002",
    folder: "02_Sentinel-1_SAR_Radar",
    filename: "S1B_IW_GRDH_20260416_CinqueTerre_WaveBackscatter.png",
    title: "Sentinel-1B Wave Orbital Velocity & Shoaling Roughness",
    location: "Cinque Terre Pocket Cove",
    region: "Ligurian Coast (Liguria, Italy)",
    coordinates: [44.1350, 9.6840],
    captureDate: "2026-04-16 17:15 UTC",
    sensor: "Copernicus Sentinel-1B C-SAR",
    resolution: "10m Equivalent Multi-Look",
    band_composite: "VV Polarization Surface Wave Roughness & Wave Crest Spectrum",
    erosion_hazard_label: "Very High",
    description: "Radar wave spectrum analysis mapping 3.8m significant wave height refraction entering the steep pocket embayment.",
    image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    tags: ["Sentinel-1", "SAR", "Wave Spectrum", "Shoaling", "Roughness"],
    transect_id_ref: "TRX-107"
  },

  // Folder 3: UAV Drone LiDAR & DEM
  {
    id: "IMG-UAV-001",
    folder: "03_UAV_Drone_LiDAR_DEM",
    filename: "UAV_LiDAR_DEM_PuntaAderci_BeachProfile.png",
    title: "UAV LiDAR High-Density 3D Beach Elevation Point Cloud",
    location: "Punta Aderci Dune Reserve",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.1855, 14.6865],
    captureDate: "2026-04-19 09:15 UTC",
    sensor: "DJI Matrice 350 RTK + Zenmuse L2 LiDAR Scanner",
    resolution: "2.5 cm/pixel Digital Elevation Model (DEM)",
    band_composite: "Classified Ground Elevation & Scarp Cut-and-Fill Volume",
    erosion_hazard_label: "Very High",
    description: "Sub-decimeter volumetric point cloud profiling a 1,840 m³ sand deficit across the upper berm following the storm event.",
    image_url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    tags: ["Drone LiDAR", "DEM", "Volumetric Survey", "Point Cloud", "3D"],
    transect_id_ref: "TRX-101"
  },
  {
    id: "IMG-UAV-002",
    folder: "03_UAV_Drone_LiDAR_DEM",
    filename: "UAV_RGB_Orthomosaic_BaiaDomizia_DuneBreach.png",
    title: "Centimeter-Accurate Drone Orthomosaic & Scarp Scar",
    location: "Baia Domizia Dune Front",
    region: "Tyrrhenian Basin (Campania, Italy)",
    coordinates: [41.2150, 13.8820],
    captureDate: "2026-04-20 11:30 UTC",
    sensor: "WingtraOne Gen II VTOL Drone (42MP Full-Frame RGB)",
    resolution: "1.2 cm/pixel Ultra-Orthomosaic",
    band_composite: "True Color RGB with Micro-Topographic Contour Overlay (0.5m)",
    erosion_hazard_label: "Very High",
    description: "Detailed photogrammetric orthomosaic showing 3 primary blowout notches in the foredune with visible root exposure.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tags: ["UAV Drone", "Orthomosaic", "Dune Breach", "Micro-contour"],
    transect_id_ref: "TRX-106"
  },

  // Folder 4: Field In-Situ Transect Photos
  {
    id: "IMG-FIELD-001",
    folder: "04_Field_Transect_Photos",
    filename: "Field_Trabocchi_PuntaAderci_Scarp_Toe.jpg",
    title: "Ground Photogrammetry of Trabocco Wooden Stilt & Berm Toe",
    location: "Costa dei Trabocchi",
    region: "Adriatic Central (Abruzzo, Italy)",
    coordinates: [42.1855, 14.6865],
    captureDate: "2026-04-21 14:00 UTC",
    sensor: "Nikon D850 Calibrated Survey Camera (50mm Lens)",
    resolution: "45.7 Megapixel Geotagged Field Record",
    erosion_hazard_label: "Very High",
    description: "In-situ field photograph documenting active wave swash undermining the gravel-sand toe directly beneath historic wooden Trabocco stilts.",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    tags: ["Field Photo", "Trabocco", "Heritage", "Toe Scour", "In-Situ"],
    transect_id_ref: "TRX-101"
  },
  {
    id: "IMG-FIELD-002",
    folder: "04_Field_Transect_Photos",
    filename: "Field_Pescara_Breakwater_Accretion.jpg",
    title: "Engineered Detached Breakwater & Salient Accretion",
    location: "Pescara River Mouth Barrier",
    region: "Adriatic North (Abruzzo, Italy)",
    coordinates: [42.4680, 14.2250],
    captureDate: "2026-04-22 09:45 UTC",
    sensor: "Sony A7R V Geotagged Survey Camera",
    resolution: "61 Megapixel In-Situ Survey Record",
    erosion_hazard_label: "Low",
    description: "Field survey illustrating successful tombolo accretion behind rock breakwaters with stable dissipative sand berm.",
    image_url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80",
    tags: ["Field Photo", "Breakwater", "Tombolo", "Accretion", "Defence"],
    transect_id_ref: "TRX-103"
  }
];

export const FOLDER_METADATA = [
  {
    id: "01_Sentinel-2_Multispectral",
    name: "01_Sentinel-2_Multispectral_Optical",
    sensorName: "Copernicus Sentinel-2 MSI (ESA / EU)",
    description: "Multi-spectral optical imagery with 13 spectral bands (VNIR/SWIR) for waterline extraction, turbidity plumes, and NDWI water indices.",
    iconName: "Satellite",
    badge: "10m GSD Optical",
    count: 3
  },
  {
    id: "02_Sentinel-1_SAR_Radar",
    name: "02_Sentinel-1_SAR_Radar_Coherence",
    sensorName: "Copernicus Sentinel-1 C-Band SAR (ESA / EU)",
    description: "All-weather day/night Synthetic Aperture Radar for surface roughness, InSAR coherence loss, and wave orbital energy mapping.",
    iconName: "Radar",
    badge: "C-Band SAR Radar",
    count: 2
  },
  {
    id: "03_UAV_Drone_LiDAR_DEM",
    name: "03_UAV_Drone_LiDAR_DEM",
    sensorName: "Zenmuse L2 UAV LiDAR & VTOL Photogrammetry",
    description: "Centimeter-precision Digital Elevation Models (DEM) and cross-shore transect volumetric cut/fill profiling.",
    iconName: "Plane",
    badge: "2.5cm Precision DEM",
    count: 2
  },
  {
    id: "04_Field_Transect_Photos",
    name: "04_Field_Transect_Photos",
    sensorName: "Geotagged DSLR Field Photogrammetry",
    description: "Calibrated on-the-ground survey photography of beach scarps, Trabocchi wooden piles, rock revetments, and foredunes.",
    iconName: "Camera",
    badge: "In-Situ Field Truth",
    count: 2
  }
];
