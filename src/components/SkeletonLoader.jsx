import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-panel p-5 rounded-2xl animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
      </div>
      <div className="h-10 bg-slate-800/80 rounded w-1/2 my-4"></div>
      <div className="h-3 bg-slate-800 rounded w-full"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="glass-panel p-4 rounded-2xl animate-pulse space-y-3">
      <div className="h-6 bg-slate-800 rounded w-1/4 mb-4"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-10 bg-slate-800/60 rounded w-full"></div>
      ))}
    </div>
  );
}
