
import './App.css'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, RefreshCw } from 'lucide-react';

const App = () => {
  // Constants
  const TOTAL_CLIENTS = 302107;
  const TOTAL_PRIZES = 50;
  const CHUNK_SIZE = Math.ceil(TOTAL_CLIENTS / TOTAL_PRIZES);

  // State
  const [currentIndex, setCurrentIndex] = useState(1);
  const [winners, setWinners] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(null);

  // Calculations for current view
  const startRange = ((currentIndex - 1) * CHUNK_SIZE) + 1;
  const endRange = Math.min(currentIndex * CHUNK_SIZE, TOTAL_CLIENTS);

  // Sync displayed number when navigating between prizes
  useEffect(() => {
    if (!isDrawing) {
      setDisplayNumber(winners[currentIndex] || null);
    }
  }, [currentIndex, winners, isDrawing]);

  // Handlers
  const handleNext = () => {
    if (currentIndex < TOTAL_PRIZES && !isDrawing) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 1 && !isDrawing) setCurrentIndex(prev => prev - 1);
  };

  const handleDraw = () => {
    if (isDrawing) return;
    
    setIsDrawing(true);
    let duration = 2000; // How long the rolling effect lasts (in milliseconds)
    let intervalTime = 50; // Speed of the number change
    let elapsed = 0;

    const min = startRange;
    const max = endRange;

    // The rolling effect interval
    const shuffleInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      setDisplayNumber(randomNum);
      elapsed += intervalTime;

      if (elapsed >= duration) {
        clearInterval(shuffleInterval);
        // Generate the final definitive winner
        const finalWinner = Math.floor(Math.random() * (max - min + 1)) + min;
        setDisplayNumber(finalWinner);
        setWinners(prev => ({
          ...prev,
          [currentIndex]: finalWinner
        }));
        setIsDrawing(false);
      }
    }, intervalTime);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
      <div className="w-full max-w-md bg-white shadow-xl min-h-screen flex flex-col relative">
        
        {/* White Navbar */}
        <nav className="bg-white border-b border-gray-100 py-2 flex justify-center items-center shadow-sm sticky top-0 z-10">
          <img 
            src="/fib-logo.png" 
            alt="Faisal Logo" 
            className="h-20 object-contain"
          />
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 max-h-[550px]  flex flex-col items-center justify-start p-6 mt-4
        ">
          
          {/* Navigation & Prize Header */}
          <div className="w-full flex items-center justify-between mb-8 bg-slate-100 rounded-2xl p-2 shadow-inner">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 1 || isDrawing}
              className={`p-3 rounded-xl transition-colors ${
                (currentIndex === 1 || isDrawing) ? 'text-gray-300' : 'text-blue-600 hover:bg-white shadow-sm'
              }`}
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>
            
            <div className="text-center">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">سحب العمرة على الجائزة رقم :</p>
              <h1 className="text-3xl font-extrabold text-blue-800">
                {currentIndex} <span className="text-xl text-slate-400 font-medium">/ {TOTAL_PRIZES}</span>
              </h1>
            </div>

            <button 
              onClick={handleNext}
              disabled={currentIndex === TOTAL_PRIZES || isDrawing}
              className={`p-3 rounded-xl transition-colors ${
                (currentIndex === TOTAL_PRIZES || isDrawing) ? 'text-gray-300' : 'text-blue-600 hover:bg-white shadow-sm'
              }`}
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
          </div>

          {/* Range Display */}
          <div className="mb-10 text-center">
            <p className="text-slate-500 mb-1 font-medium">أرقام البطاقات</p>
            <div className="inline-block bg-blue-50 border border-blue-100 text-blue-800 font-mono text-lg px-6 py-2 rounded-lg font-bold tracking-widest">
              من {startRange.toLocaleString()} إلى {endRange.toLocaleString()}
            </div>
          </div>

          {/* Winner Display Area */}
          <div className="flex-1 max-h-[250px] flex flex-col items-center justify-center w-full">
            {displayNumber ? (
              <div className="text-center">
                <Trophy 
                  className={`mx-auto mb-4 ${isDrawing ? 'text-slate-300 animate-pulse' : 'text-yellow-400 animate-in zoom-in duration-300'}`} 
                  size={48} 
                />
                <p className={`font-medium mb-2 text-lg ${isDrawing ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isDrawing ? 'يتم السحب...' : 'الرقم الفائز هو:'}
                </p>
                <div className={`text-6xl font-black tracking-tighter ${isDrawing ? 'text-slate-700' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
                  {displayNumber.toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-300">
                <Trophy className="mx-auto mb-4 opacity-50" size={48} />
                <p className="text-lg font-medium">اضغط للبدء...</p>
              </div>
            )}
          </div>

        </main>

        {/* Bottom Action Area */}
        <div className="p-6 bg-white border-t border-gray-100 pb-safe">
          <button
            onClick={handleDraw}
            disabled={isDrawing}
            className={`w-full font-bold text-xl py-5 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              isDrawing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl active:scale-[0.98]'
            }`}
          >
            {isDrawing ? (
              <>
                <RefreshCw className="animate-spin" size={24} />
                يتم السحب...
              </>
            ) : winners[currentIndex] ? (
              <>
                <RefreshCw size={24} />
                إعادة السحب
              </>
            ) : (
              'اختر الفائز'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;