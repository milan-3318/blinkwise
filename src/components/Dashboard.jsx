import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertCircle, BarChart3, Brain, Camera, Heart, Moon, RefreshCw, Smile, Zap } from 'lucide-react';
import { useMediaPipe } from '../hooks/useMediaPipe.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Dashboard({ onEnd }) {
  const [videoElement, setVideoElement] = useState(null);
  const metrics = useMediaPipe(videoElement);
  const { afi, emotion, blinkCount, ear, isLoading, error: cameraError } = metrics;
  
  const [risk, setRisk] = useState('Low');
  const [sessionHistory, setSessionHistory] = useState([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), afi: 0 }]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (afi > 60) setRisk('High');
    else if (afi > 30) setRisk('Moderate');
    else setRisk('Low');
  }, [afi]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isLoading && !showSummary) {
        setElapsedSeconds(s => s + 1);
      }
    }, 1000);

    const interval = setInterval(() => {
      if (!isLoading && !showSummary) {
        setSessionHistory(prev => {
          const newPoint = { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            afi 
          };
          return [...prev.slice(-14), newPoint];
        });
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [isLoading, showSummary, afi]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const avgAfi = sessionHistory.length > 0 
    ? Math.round(sessionHistory.reduce((acc, curr) => acc + curr.afi, 0) / sessionHistory.length) 
    : 0;

  if (showSummary) {
    return (
      <div className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-xl flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full bg-white rounded-[40px] p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Brain size={200} />
          </div>
          
          <h2 className="text-4xl font-bold text-navy mb-2">Session Complete</h2>
          <p className="text-slate-500 mb-10">Here is how you performed today.</p>
          
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-slate-50 rounded-3xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Total Time</div>
              <div className="text-3xl font-bold text-navy">{formatTime(elapsedSeconds)}</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Avg Fatigue</div>
              <div className="text-3xl font-bold text-primary">{avgAfi}%</div>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Burnout Risk</div>
              <div className={`text-3xl font-bold ${risk === 'Low' ? 'text-accent-green' : 'text-accent-red'}`}>{risk}</div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <h4 className="font-bold text-navy">AI Insights</h4>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-sm text-slate-700 leading-relaxed">
              {risk === 'Low' 
                ? "Excellent focus! You maintained a low fatigue index throughout the session. Your cognitive efficiency was optimal."
                : "You pushed through significant fatigue today. We recommend a 20-minute restorative break before your next task."}
            </div>
          </div>

          <button 
            onClick={() => onEnd({
              history: sessionHistory,
              avgAfi,
              risk,
              duration: formatTime(elapsedSeconds),
              endTime: new Date().toISOString()
            })}
            className="w-full btn-primary py-4 text-lg"
          >
            Generate Detailed Report
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 pb-24">
      <div className="col-span-12 flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-navy uppercase tracking-tight">Live Study Session</h2>
          <p className="text-slate-500 font-medium">Elapsed: <span className="text-primary font-mono">{formatTime(elapsedSeconds)}</span></p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-accent-green/10 text-accent-green rounded-full text-sm font-semibold flex items-center gap-2 border border-accent-green/20">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            AI Monitoring Live
          </div>
          <button 
            onClick={() => setShowSummary(true)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-navy hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="glass-card overflow-hidden relative aspect-video bg-slate-900 shadow-2xl border-0">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <video 
              ref={setVideoElement}
              className="w-full h-full object-cover opacity-50 grayscale scale-x-[-1]"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
          </div>

          {(isLoading || cameraError) && (
            <div className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
              {cameraError ? (
                <>
                  <Camera size={48} className="text-accent-red mb-4" />
                  <h4 className="text-xl font-bold mb-2">Camera Access Required</h4>
                  <p className="text-sm text-white/60 max-w-sm mb-6">{cameraError}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-primary rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors"
                  >
                    Retry Camera Access
                  </button>
                </>
              ) : (
                <>
                  <RefreshCw size={48} className="animate-spin text-primary mb-4" />
                  <h4 className="text-xl font-bold mb-2">Initializing Vision Engine</h4>
                  <p className="text-sm text-white/60 max-w-xs">Please allow camera access and stay in view to start monitoring your session.</p>
                </>
              )}
            </div>
          )}

          <div className="absolute top-6 left-6 flex gap-4">
            <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white flex items-center gap-2 border border-white/10">
              <Smile size={16} className={emotion === 'Tired' ? 'text-accent-red' : 'text-accent-green'} />
              <span className="text-xs font-bold uppercase">{emotion}</span>
            </div>
            <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-xl text-white flex items-center gap-2 border border-white/10">
              <Zap size={16} className="text-primary-light" />
              <span className="text-xs font-bold">AFI: {afi}%</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 shadow-2xl border-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-navy flex items-center gap-3">
              <BarChart3 className="text-primary" />
              Cognitive Load Real-Time
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-xs font-bold text-slate-400 uppercase">AFI Score</span>
              </div>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionHistory}>
                <defs>
                  <linearGradient id="colorAfi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="afi" stroke="#2563EB" strokeWidth={4} fillOpacity={1} fill="url(#colorAfi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="glass-card p-6 shadow-2xl border-0">
          <h3 className="text-lg font-bold text-navy mb-6">Real-Time Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                  <Activity size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">Blinks / Min</span>
              </div>
              <span className="text-xl font-black text-navy">{blinkCount}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent-yellow">
                  <Heart size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">Focus Stability</span>
              </div>
              <span className="text-xl font-black text-navy">High</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-light">
                  <Moon size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">Fatigue Risk</span>
              </div>
              <span className={`text-xl font-black ${risk === 'High' ? 'text-accent-red' : 'text-accent-green'}`}>{risk}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 shadow-2xl border-0 bg-navy text-white">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-primary-light" />
            AI Intervention
          </h3>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm leading-relaxed text-white/80">
            {afi > 40 
              ? "We've detected a significant rise in your fatigue index. Time for a 5-minute eye-rest or hydration break."
              : "Optimal cognitive performance detected. Keep up the good work! Don't forget to blink regularly."}
          </div>
          <button className="w-full mt-6 py-3 bg-primary rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
            Start Wellness Break
          </button>
        </div>
      </div>
    </div>
  );
}
