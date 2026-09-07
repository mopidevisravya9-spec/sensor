import React, { useState } from 'react';

const RASPBERRY_PI_CAMERA =
  'http://10.45.119.62:8000/camera/stream';

export default function AICameraView({
  activeDeviceId,
  devices = [],
}) {
  const [cameraError, setCameraError] = useState(false);

  const device =
    devices.find(
      (d) => d.device_id === activeDeviceId
    ) || devices[0];

  return (
    <div className="w-full">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              AI Drainage Optical Camera
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Raspberry Pi 5 • Live YOLO Camera
            </p>
          </div>

        </div>

        {/* Camera Status */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">

          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>

          <span className="text-sm text-emerald-400 font-medium">
            CAMERA LIVE
          </span>

        </div>

      </div>


      {/* Main Camera Card */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Live Camera */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-700/60 bg-[#0d1422] overflow-hidden">

          {/* Camera Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">

            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Raspberry Pi Live Camera
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Device: {activeDeviceId || 'DRAIN-001'}
              </p>
            </div>

            <div className="flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>

              <span className="text-xs font-mono text-red-400">
                LIVE
              </span>

            </div>

          </div>


          {/* Camera Display */}
          <div
            className="relative bg-black"
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              minHeight: '400px',
            }}
          >

            {!cameraError ? (
              <img
                src={RASPBERRY_PI_CAMERA}
                alt="Raspberry Pi Live Camera"
                onError={() => setCameraError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712]">

                <div className="text-5xl mb-4">
                  ⚠️
                </div>

                <h3 className="text-lg font-semibold text-slate-300">
                  Camera Offline
                </h3>

                <p className="text-sm text-slate-500 mt-2 text-center max-w-md">
                  Unable to connect to the Raspberry Pi camera.
                </p>

                <p className="text-xs text-slate-600 mt-3 font-mono">
                  10.45.119.45:8000
                </p>

                <button
                  onClick={() => setCameraError(false)}
                  className="mt-5 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition"
                >
                  Retry Camera
                </button>

              </div>
            )}

            {/* YOLO Overlay */}
            <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-black/70 border border-cyan-500/30 backdrop-blur-sm">

              <div className="text-xs text-cyan-400 font-mono">
                YOLO VISION
              </div>

              <div className="text-[10px] text-slate-400 mt-1">
                Raspberry Pi 5
              </div>

            </div>

          </div>


          {/* Camera Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700/50">

            <div className="flex items-center gap-4">

              <div>
                <span className="text-xs text-slate-500">
                  SOURCE
                </span>

                <p className="text-xs text-slate-300 font-mono mt-1">
                  Raspberry Pi Camera
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">
                  STREAM
                </span>

                <p className="text-xs text-slate-300 font-mono mt-1">
                  640 × 480
                </p>
              </div>

            </div>

            <div className="text-xs text-emerald-400 font-mono">
              LIVE STREAM
            </div>

          </div>

        </div>


        {/* Computer Vision Telemetry */}
        <div className="rounded-2xl border border-slate-700/60 bg-[#0d1422] p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <span className="text-xl">👁️</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Computer Vision
              </h2>

              <p className="text-xs text-slate-500">
                YOLO Detection
              </p>
            </div>

          </div>


          {/* Detection Status */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-700/50 p-4 mb-4">

            <div className="text-xs text-slate-500 uppercase tracking-wider">
              Detection Engine
            </div>

            <div className="flex items-center gap-2 mt-2">

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>

              <span className="text-emerald-400 font-medium">
                ACTIVE
              </span>

            </div>

          </div>


          {/* Device */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-700/50 p-4 mb-4">

            <div className="text-xs text-slate-500 uppercase tracking-wider">
              Device
            </div>

            <div className="text-slate-200 font-mono mt-2">
              {activeDeviceId || 'DRAIN-001'}
            </div>

          </div>


          {/* Detection Classes */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-700/50 p-4">

            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
              Detection Classes
            </div>

            <div className="space-y-2">

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Clear
                </span>
                <span className="text-sm text-slate-300">
                  —
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Mud buildup
                </span>
                <span className="text-sm text-slate-300">
                  —
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Leaf / solid waste
                </span>
                <span className="text-sm text-slate-300">
                  —
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Blockage
                </span>
                <span className="text-sm text-slate-300">
                  —
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Water flow
                </span>
                <span className="text-sm text-slate-300">
                  —
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}