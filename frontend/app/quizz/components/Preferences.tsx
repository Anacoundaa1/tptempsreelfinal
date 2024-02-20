import React from 'react';
import { usePreferences } from '../PreferencesContext';

const Preferences = () => {
  const { selectedTime, setTime, selectedQuestionCount, setQuestionCount } = usePreferences();

  const handleTimeClick = (time: number) => {
    setTime(time);
  };

  const handleQuestionCountClick = (count: number) => {
    setQuestionCount(count);
  };

  return (
    <div className="flex flex-col gap-24 items-center justify-center text-white mt-24">
      <div className="flex flex-col items-center">
        <p className="text-2xl fontspring">Temps par question</p>
        <div className="grid grid-cols-3 gap-24 mt-8">
          <div className={`box px-5 py-3 cursor-pointer ${selectedTime === 10 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleTimeClick(10)}>
            <p className="text-white fontspring text-green-400">10 secondes</p>
          </div>
          <div className={`box px-5 py-3 cursor-pointer ${selectedTime === 15 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleTimeClick(15)}>
            <p className="text-white fontspring text-green-400">15 secondes</p>
          </div>
          <div className={`box px-5 py-3 cursor-pointer ${selectedTime === 20 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleTimeClick(20)}>
            <p className="text-white fontspring text-green-400">20 secondes</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-2xl fontspring">Nombre de questions</p>
        <div className="grid grid-cols-3 gap-24 mt-8">
          <div className={`box px-5 py-3 cursor-pointer ${selectedQuestionCount === 10 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleQuestionCountClick(10)}>
            <p className="text-white fontspring text-green-400">10 questions</p>
          </div>
          <div className={`box px-5 py-3 cursor-pointer ${selectedQuestionCount === 15 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleQuestionCountClick(15)}>
            <p className="text-white fontspring text-green-400">15 questions</p>
          </div>
          <div className={`box px-5 py-3 cursor-pointer ${selectedQuestionCount === 20 ? 'bg-linear rounded-lg' : ''}`} onClick={() => handleQuestionCountClick(20)}>
            <p className="text-white fontspring text-green-400">20 questions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;