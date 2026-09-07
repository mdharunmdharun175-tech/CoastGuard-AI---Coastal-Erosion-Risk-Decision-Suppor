import React, { useState } from "react";
import { CoastalTransect, DatasetImageItem } from "../types";
import { FULL_COASTAL_DATASET, downloadCSVFile, parseUploadedCSV, generateDatasetCSV } from "../data/coastal_dataset";
import { COASTAL_IMAGE_DATASET, FOLDER_METADATA } from "../data/imagery_dataset";
import { 
  Database, 
  Folder, 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  MapPin, 
  Satellite, 
  Radar, 
  Plane, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  X, 
  ExternalLink,
  Layers
} from "lucide-react";

interface DatasetExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTransects?: (newTransects: CoastalTransect[]) => void;
}

export const DatasetExplorerModal: React.FC<DatasetExplorerModalProps> = ({
  isOpen,
  onClose,
  onImportTransects
}) => {
  const [activeTab, setActiveTab] = useState<"csv-table" | "image-folders">("csv-table");
  
  // CSV Tab State
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  
  // Image Folders Tab State
  const [selectedFolder, setSelectedFolder] = useState<string>("ALL");
  const [selectedImage, setSelectedImage] = useState<DatasetImageItem | null>(null);

  if (!isOpen) return null;

  // Filter CSV rows
  const filteredDataset = FULL_COASTAL_DATASET.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === "ALL" || t.risk_class === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  // Filter Images
  const filteredImages = COASTAL_IMAGE_DATASET.filter((img) => {
    return selectedFolder === "ALL" || img.folder === selectedFolder;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const { transects, errors } = parseUploadedCSV(text);
        if (errors.length > 0) {
          setImportStatus(`Import Error: ${errors.join(", ")}`);
        } else if (transects.length > 0) {
          if (onImportTransects) {
            onImportTransects(transects);
          }
          setImportStatus(`Successfully loaded ${transects.length} transects from CSV!`);
          setTimeout(() => setImportStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
  };

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case "Satellite":
        return <Satellite className="w-4 h-4 text-cyan-400" />;
      case "Radar":
        return <Radar className="w-4 h-4 text-purple-400" />;
      case "Plane":
        return <Plane className="w-4 h-4 text-emerald-400" />;
      case "Camera":
      default:
        return <Camera className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Coastal Erosion Dataset & Image Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Calibrated research records, raw CSV tabular data & satellite / drone imagery folders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                id="tab-dataset-csv"
                onClick={() => setActiveTab("csv-table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "csv-table"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>CSV Dataset Table</span>
              </button>

              <button
                id="tab-dataset-images"
                onClick={() => setActiveTab("image-folders")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "image-folders"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Dataset Image Folders</span>
              </button>
            </div>

            <button
              id="btn-close-dataset-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {importStatus && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2 ${
              importStatus.includes("Error")
                ? "bg-rose-950/60 border-rose-800 text-rose-300"
                : "bg-emerald-950/60 border-emerald-800 text-emerald-300"
            }`}>
              {importStatus.includes("Error") ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
              <span>{importStatus}</span>
            </div>
          )}

          {/* TAB 1: CSV DATASET TABLE */}
          {activeTab === "csv-table" && (
            <div className="space-y-4">
              
              {/* Actions & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search transect records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Risk Filter */}
                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="Very High">Very High Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="Low">Low Risk</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  
                  {/* Upload CSV Input */}
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Upload CSV</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Download CSV Button */}
                  <button
                    id="btn-download-full-csv"
                    onClick={() => downloadCSVFile("coastguard_coastal_erosion_dataset.csv")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Dataset CSV (.csv)</span>
                  </button>

                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Transect ID</th>
                      <th className="py-2.5 px-3">Site Location</th>
                      <th className="py-2.5 px-3">Slope (%)</th>
                      <th className="py-2.5 px-3">Storm Count</th>
                      <th className="py-2.5 px-3">Wave Energy (kW/m)</th>
                      <th className="py-2.5 px-3">Closure Depth (m)</th>
                      <th className="py-2.5 px-3">Substrate</th>
                      <th className="py-2.5 px-3">Drift</th>
                      <th className="py-2.5 px-3">Risk Class</th>
                      <th className="py-2.5 px-3">Susceptibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredDataset.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2 px-3 font-bold text-cyan-400">{t.id}</td>
                        <td className="py-2 px-3 font-sans text-slate-200 font-medium">
                          {t.name}
                          <span className="block text-[10px] text-slate-400">{t.region}</span>
                        </td>
                        <td className="py-2 px-3 text-slate-300">{t.slope}%</td>
                        <td className="py-2 px-3 text-slate-300">{t.storm_count}</td>
                        <td className="py-2 px-3 text-amber-300">{t.storm_energy}</td>
                        <td className="py-2 px-3 text-emerald-300">{t.depth_of_closure}</td>
                        <td className="py-2 px-3 capitalize text-slate-300">{t.geomorphology}</td>
                        <td className="py-2 px-3 capitalize text-slate-300">{t.longshore_direction}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.risk_class === "Very High" ? "bg-rose-950 text-rose-400 border border-rose-800" :
                            t.risk_class === "High" ? "bg-orange-950 text-orange-400 border border-orange-800" :
                            t.risk_class === "Medium" ? "bg-amber-950 text-amber-400 border border-amber-800" :
                            "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          }`}>
                            {t.risk_class}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-100">
                          {(t.susceptibility_index || t.probability * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono pt-1">
                <span>Showing {filteredDataset.length} of {FULL_COASTAL_DATASET.length} transects</span>
                <span>Format: CSV (Comma-Separated Values) &bull; Schema: 17 Calibrated Predictors</span>
              </div>

            </div>
          )}

          {/* TAB 2: DATASET FOLDERS IN IMAGE FORMAT */}
          {activeTab === "image-folders" && (
            <div className="space-y-6">
              
              {/* Folder Selector Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedFolder("ALL")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedFolder === "ALL"
                      ? "bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Folder className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                      {COASTAL_IMAGE_DATASET.length} Images
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 mt-2 text-xs">All Imagery Folders</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">Complete multi-sensor library</p>
                </button>

                {FOLDER_METADATA.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFolder(f.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedFolder === f.id
                        ? "bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500/40"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {getFolderIcon(f.iconName)}
                      <span className="font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                        {f.count} Files
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 mt-2 text-xs truncate">{f.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{f.badge}</p>
                  </button>
                ))}
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-cyan-500/60 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail Container */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        <img
                          src={img.image_url}
                          alt={img.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        
                        {/* Badges on Image */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950/90 text-cyan-300 border border-slate-700 font-bold">
                            {img.folder}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                            img.erosion_hazard_label === "Very High" ? "bg-rose-600 text-white" :
                            img.erosion_hazard_label === "High" ? "bg-orange-600 text-white" :
                            img.erosion_hazard_label === "Medium" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
                          }`}>
                            {img.erosion_hazard_label} Risk
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-2.5 right-2.5">
                          <p className="font-bold text-white text-xs line-clamp-1">{img.title}</p>
                          <p className="text-[10px] text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{img.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Image Metadata Body */}
                      <div className="p-3.5 space-y-2">
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {img.description}
                        </p>

                        <div className="space-y-1 font-mono text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <div className="flex justify-between">
                            <span>Sensor:</span>
                            <span className="text-slate-200 truncate ml-2">{img.sensor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Resolution:</span>
                            <span className="text-cyan-300">{img.resolution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Acquisition:</span>
                            <span className="text-slate-300">{img.captureDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Trigger */}
                    <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400 text-[10px]">{img.filename}</span>
                      <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Image</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>CoastGuard AI &bull; Earth Observation & Geomorphological Dataset Repository</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close Explorer
          </button>
        </div>

      </div>

      {/* High-Resolution Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-6">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedImage.folder} / {selectedImage.filename}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedImage.title}</h3>
                <p className="text-xs text-slate-400">{selectedImage.location} &bull; [{selectedImage.coordinates.join(", ")}]</p>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Scientific Description & Finding</span>
                <p className="text-slate-300 leading-relaxed text-xs">{selectedImage.description}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-slate-800">
                  <span className="text-slate-400">Sensor:</span>
                  <span className="text-cyan-300">{selectedImage.sensor}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800">
                  <span className="text-slate-400">Resolution:</span>
                  <span className="text-emerald-300">{selectedImage.resolution}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800">
                  <span className="text-slate-400">Overpass Date:</span>
                  <span className="text-slate-200">{selectedImage.captureDate}</span>
                </div>
                {selectedImage.band_composite && (
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Band Mask:</span>
                    <span className="text-amber-300 truncate ml-2">{selectedImage.band_composite}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
