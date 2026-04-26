import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Brain, Clock, Moon } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: '',
    studyHours: '',
    sleepHours: ''
  });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(data);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy flex items-center justify-center p-6">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#2563EB,transparent_70%)]" />
      </div>

      <motion.div 
        layout
        className="max-w-xl w-full bg-white rounded-[40px] p-12 shadow-2xl relative z-10"
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-slate-100'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 3</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Brain size={32} />
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4">Your Profile</h3>
              <p className="text-slate-500 mb-8">Tell us a bit about yourself to calibrate the AI vision engine.</p>
              <div className="space-y-2">
                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Your Age</label>
                <input 
                  type="number" 
                  placeholder="e.g. 20"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-colors text-lg font-bold"
                  value={data.age}
                  onChange={e => setData({...data, age: e.target.value})}
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Clock size={32} />
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4">Study Habits</h3>
              <p className="text-slate-500 mb-8">How many hours do you typically study per day?</p>
              <div className="space-y-2">
                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Daily Study Hours</label>
                <input 
                  type="number" 
                  placeholder="e.g. 6"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-colors text-lg font-bold"
                  value={data.studyHours}
                  onChange={e => setData({...data, studyHours: e.target.value})}
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                <Moon size={32} />
              </div>
              <h3 className="text-4xl font-bold text-navy mb-4">Sleep Duration</h3>
              <p className="text-slate-500 mb-8">Average sleep hours per night?</p>
              <div className="space-y-2">
                <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Average Sleep</label>
                <input 
                  type="number" 
                  placeholder="e.g. 7"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-primary transition-colors text-lg font-bold"
                  value={data.sleepHours}
                  onChange={e => setData({...data, sleepHours: e.target.value})}
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={next}
          className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg mt-12"
        >
          {step === 3 ? 'Complete Calibration' : 'Continue'}
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
