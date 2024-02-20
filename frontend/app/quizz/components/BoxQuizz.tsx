import React from 'react';
import { useEffect } from 'react';
import { usePreferences } from '../PreferencesContext';

interface BoxQuizzProps {
  title: string;
  description: string;
  isQuizzRapide?: boolean;  // Nouveau prop
}

const BoxQuizz: React.FC<BoxQuizzProps> = ({ title, description, isQuizzRapide }) => {
  
  const { selectedDifficulty, setDifficulty, selectedQuizzTitle, setQuizzTitle, setTime, setQuestionCount } = usePreferences();
  const [localDifficulty, setLocalDifficulty] = React.useState('');

  const handleDifficultyClick = (difficulty: string) => {
    setLocalDifficulty(difficulty);
    setDifficulty(difficulty);
    setQuizzTitle(title);

    // Vérifiez si le composant est appelé dans QuizzRapide
    if (isQuizzRapide) {
      // Mettez à jour les variables de contexte spécifiques à QuizzRapide
      setTime(10);
      setQuestionCount(10);
    }
  };

  // Mettez à jour le state local lorsque le titre du quizz change dans le contexte
  useEffect(() => {
    if (selectedQuizzTitle !== title) {
      setLocalDifficulty('');
    }
  }, [selectedQuizzTitle, title]);

  return (
    <div className="box mt-10 p-5 flex flex-col gap-8 bg-transparent">
      <p className="text-white fontspring text-xl">{title}</p>
      <p className="text-lg text-grey sky">{description}</p>
      <div className='flex justify-between'>
        <div className={`box px-5 py-3 cursor-pointer ${localDifficulty === 'facile' ? 'bg-green-900 rounded-lg' : ''}`} onClick={() => handleDifficultyClick('facile')}>
          <p className="fontspring text-green-400">Facile</p>
        </div>
        <div className={`box px-5 py-3 cursor-pointer ${localDifficulty === 'moyen' ? 'bg-orange-900 rounded-lg' : ''}`} onClick={() => handleDifficultyClick('moyen')}>
          <p className="fontspring text-orange-400">Moyen</p>
        </div>
        <div className={`box px-5 py-3 cursor-pointer ${localDifficulty === 'difficile' ? 'bg-red-900 rounded-lg' : ''}`} onClick={() => handleDifficultyClick('difficile')}>
          <p className="fontspring text-red-400">Difficile</p>
        </div>
      </div>
    </div>
  );
};

export default BoxQuizz;
