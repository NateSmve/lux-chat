'use client';

import { useEffect, useRef } from 'react';

interface ProgressPanelProps {
  activities: string[];
}

export function ProgressPanel({ activities }: ProgressPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-black/40 backdrop-blur-lg border-l border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-bold flex items-center gap-2">
          <span>📊</span> Activity Feed
        </h2>
        <p className="text-white/60 text-sm">See what Lux is working on</p>
      </div>
      
      <div ref={scrollRef} className="p-4 h-[calc(100%-80px)] overflow-y-auto space-y-2">
        {activities.length === 0 ? (
          <p className="text-white/40 text-sm text-center py-8">No activity yet...</p>
        ) : (
          activities.map((activity, i) => (
            <div 
              key={i}
              className="bg-white/5 rounded-lg p-3 text-sm text-white/80 border border-white/10"
            >
              <div className="flex items-start gap-2">
                <span className="text-purple-400">→</span>
                <span>{activity}</span>
              </div>
              <p className="text-white/40 text-xs mt-1">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
