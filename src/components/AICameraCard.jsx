import React, { useEffect, useState } from 'react';
import {
  Camera,
  AlertCircle,
  Eye,
  Cpu,
} from 'lucide-react';

const API_BASE = 'http://10.222.208.45:8000';

export default function AICameraCard({ cameraData }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  const imagePath = cameraData?.live_feed || cameraData?.snapshot;

  /*
   * Check whether the Django camera API says
   * that the Raspberry Pi camera is active.
   */
  const isAvailable =
    cameraData &&
    (cameraData.camera_status === 'ACTIVE' || cameraData.camera_status === 'BLOCKED') &&
    imagePath &&
    !imageError;

  /*
   * Convert Django's relative image path:
   *
   * /media/camera_snapshots/example.jpg
   *
   * into:
   *
   * http://10.222.208.45:8000/media/camera_snapshots/example.jpg
   *
   * The timestamp parameter prevents the browser from
   * displaying an old cached image.
   */
  useEffect(() => {
    if (!imagePath) {
      setImageUrl(null);
      setImageError(false);
      return;
    }

    const feedUrl = imagePath.startsWith('http')
      ? imagePath
      : `${API_BASE}/${imagePath.replace(/^\//, '')}`;

    const freshImageUrl = `${feedUrl}?t=${Date.now()}`;

    setImageUrl(freshImageUrl);
    setImageError(false);
  }, [
    imagePath,
    cameraData?.timestamp,
  ]);

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2">

          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Camera className="w-4 h-4" />
          </div>

          <span className="text-sm font-semibold text-slate-200">
            AI Drainage Optical Camera
          </span>

        </div>

        {/* Camera / AI Status */}
        <span
          className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
            isAvailable
              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >

          <Cpu className="w-3 h-3" />

          {isAvailable
            ? 'AI DETECT: ACTIVE'
            : 'CAMERA OFFLINE'}

        </span>

      </div>


      {/* =====================================================
          CAMERA FRAME
      ====================================================== */}
      <div className="relative my-3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[220px] flex items-center justify-center">

        {isAvailable && imageUrl ? (

          <div className="relative w-full h-full">

            {/* Raspberry Pi Camera Image */}
            <img
              src={imageUrl}
              alt="Raspberry Pi AI Camera Drain Surveillance"
              className="w-full h-52 object-cover"
              onError={(event) => {
                console.error(
                  'Raspberry Pi camera image failed to load:',
                  imageUrl
                );
                setImageError(true);
              }}
            />


            {/* =================================================
                AI OVERLAY
            ================================================== */}
            <div className="absolute inset-0 border-2 border-dashed border-cyan-400/60 m-4 rounded pointer-events-none flex items-start p-2">

              <span className="bg-cyan-950/90 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-700/60 flex items-center gap-1">

                <Eye className="w-3 h-3" />

                AI Drain Blockage Analysis

              </span>

            </div>


            {/* =================================================
                BLOCKAGE PERCENTAGE
            ================================================== */}
            {cameraData.blockage_percentage !== null &&
              cameraData.blockage_percentage !== undefined && (

                <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-slate-800 p-2.5 rounded-lg font-mono text-right">

                  <div className="text-[10px] text-slate-400">
                    BLOCKAGE LEVEL
                  </div>

                  <div className="text-sm font-bold text-amber-400">
                    {cameraData.blockage_percentage}%
                  </div>

                </div>

              )}

          </div>

        ) : (

          /* ===================================================
             CAMERA NOT AVAILABLE
          ==================================================== */
          <div className="p-6 text-center flex flex-col items-center justify-center">

            <AlertCircle className="w-8 h-8 text-purple-400/60 mb-2 animate-pulse" />

            <span className="text-sm font-medium font-mono text-slate-300">
              Waiting for Camera...
            </span>

            <span className="text-xs text-slate-500 mt-1 max-w-xs">
              No live camera image received from Raspberry Pi
            </span>

          </div>

        )}

      </div>


      {/* =====================================================
          AI OBJECT DETECTION TAGS
      ====================================================== */}
      {isAvailable && (

          <div className="my-2">

            <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
              DETECTED OBJECTS:
            </span>

            <div className="flex flex-wrap gap-1.5">

              {cameraData.detected_objects?.length > 0 ? cameraData.detected_objects.map((obj, idx) => (

                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50 text-xs font-mono"
                >
                  {obj}
                </span>

              )) : <span className="text-xs font-mono text-slate-400">No objects detected</span>}

            </div>

          </div>

        )}


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-slate-400 font-mono">

        <span>
          {cameraData?.camera_status || 'CAMERA OFFLINE'} / {cameraData?.ai_detection || 'No detection data'}
        </span>

        <span>
          {cameraData?.timestamp
            ? `Captured: ${cameraData.timestamp.slice(11, 19)}`
            : 'No capture timestamp'}
        </span>

      </div>

    </div>
  );
}