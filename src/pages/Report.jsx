import React from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, TrendingUp, Clock, AlertTriangle, CheckCircle2, ArrowLeft, Brain } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Report({ sessionData, onBack }) {
  const { history, avgAfi, risk, duration, endTime } = sessionData;

  // Dynamic Analysis Logic
  const analyzeSession = () => {
    const dropOffPoint = history.find(p => p.afi > 40);
    const maxAfi = Math.max(...history.map(p => p.afi));
    
    let insights = [];
    if (dropOffPoint) {
      insights.push({
        title: "Focus Drop-off Detected",
        desc: `Your cognitive load spiked significantly at the ${dropOffPoint.time} mark.`,
        icon: <AlertTriangle size={18} className="text-accent-yellow" />
      });
    } else {
      insights.push({
        title: "High Focus Stability",
        desc: "You maintained exceptional cognitive control throughout this entire session.",
        icon: <CheckCircle2 size={18} className="text-accent-green" />
      });
    }

    if (maxAfi > 70) {
      insights.push({
        title: "Critical Fatigue Alert",
        desc: "Peak fatigue reached dangerous levels. Shorter study sprints (Pomodoro) are highly recommended.",
        icon: <Zap size={18} className="text-accent-red" />
      });
    }

    return insights;
  };

  const getRecoveryPlan = () => {
    if (avgAfi > 50) return [
      "15-minute complete digital detox (no screens)",
      "Hydration: Drink 500ml of water immediately",
      "Deep breathing exercise: 4-7-8 technique for 3 minutes"
    ];
    if (avgAfi > 25) return [
      "5-minute eye-rest (20-20-20 rule)",
      "Light stretching or a short walk",
      "Quick protein-rich snack"
    ];
    return [
      "Short 2-minute stretch",
      "Refill water bottle",
      "Ready for next sprint in 5 mins"
    ];
  };

  const insights = analyzeSession();
  const recoveryPlan = getRecoveryPlan();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-navy text-white pt-12 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="container mx-auto px-6 relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest mb-4">
                Session Report
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">Performance Summary</h1>
              <p className="text-white/60 font-medium">Session ended on {new Date(endTime).toLocaleString()}</p>
            </div>
            
            <button className="px-8 py-4 bg-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/20 cursor-pointer">
              <Download size={20} />
              Export Detailed PDF
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Duration', value: duration, icon: <Clock className="text-primary" />, desc: 'Study time' },
            { label: 'Average Fatigue', value: `${avgAfi}%`, icon: <TrendingUp className="text-accent-yellow" />, desc: 'AFI Score' },
            { label: 'Risk Level', value: risk, icon: risk === 'Low' ? <CheckCircle2 className="text-accent-green" /> : <AlertTriangle className="text-accent-red" />, desc: 'Burnout risk' },
            { label: 'Efficiency', value: '88%', icon: <RefreshCw className="text-primary-light" />, desc: 'Focus score' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 flex items-center gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                <div className="text-2xl font-bold text-navy">{stat.value}</div>
                <div className="text-[10px] text-slate-400 font-medium">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-navy mb-8 flex items-center gap-3">
              <Brain size={24} className="text-primary" />
              Cognitive Load Over Time
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="reportAfi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="afi" stroke="#2563EB" strokeWidth={5} fillOpacity={1} fill="url(#reportAfi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-navy mb-8">AI Diagnostics</h3>
              <div className="space-y-6">
                {insights.map((insight, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="font-bold text-navy mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                      {insight.icon}
                      {insight.title}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {insight.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-navy text-white rounded-[40px] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-primary-light">Personalized Recovery Plan</div>
                <div className="space-y-3 mb-8">
                  {recoveryPlan.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-white/80 leading-snug">
                      <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center text-[10px] text-primary-light shrink-0">{i+1}</div>
                      {step}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-primary rounded-2xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/40 cursor-pointer">
                  View Full Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
