import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, Brain } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-32">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-accent-green/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} /> Next-Gen Behavioral Health
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-navy leading-[0.95] tracking-tight mb-8">
              Focus <span className="text-primary italic">Deep.</span><br />
              Study <span className="text-primary">Better.</span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              Prevent burnout before it happens. Our AI monitors your <span className="text-navy font-bold">Academic Fatigue Index</span> in real-time using ocular metrics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onStart} className="btn-primary group flex items-center justify-center gap-3 text-lg">
                Start Study Session
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 bg-white border border-slate-200 text-navy font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
                <Play size={20} className="fill-navy" /> See Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-slate-200 pt-8">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary/30 to-accent-green/30" />
                ))}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-bold text-navy">2.4k+</span> Students optimizing sessions
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-navy aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-navy/50 to-transparent z-10" />
              <div className="relative z-20 flex flex-col items-center gap-4 text-white">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-pulse">
                  <Shield size={40} />
                </div>
                <p className="font-medium">Vision Engine Ready</p>
                <div className="flex gap-1">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-4 bg-accent-green rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 glass-card p-4 flex flex-col justify-center gap-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Fatigue Index</div>
              <div className="text-2xl font-bold text-primary">12%</div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/4 h-full bg-primary" /></div>
            </div>

            <div className="absolute -bottom-10 -left-10 w-48 h-24 glass-card p-5 flex items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center text-accent-green"><Zap size={24} /></div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase">Focus Level</div>
                <div className="text-xl font-bold text-navy">Optimal</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
