// QuizzRapide.tsx
import React, { useEffect } from 'react';
import BoxQuizz from './BoxQuizz';
// import { usePreferences } from '../PreferencesContext';

const QuizzRapide = () => {
  const quizData = [
    {
      title: 'Animaux',
      description: 'Un quiz pour tester vos connaissances sur le règne animal. ROOOAR!',
    },
    {
      title: 'Pays',
      description: 'Un quiz pour découvrir des faits intéressants sur différents pays du monde.',
    },
    {
      title: 'Capitales',
      description: 'Testez vos connaissances sur les capitales du monde avec ce quiz captivant.',
    },
  ];

  // const {
  //   selectedDifficulty,
  //   selectedQuizzTitle,
  //   selectedTime,
  //   selectedQuestionCount,
  // } = usePreferences();

  // useEffect(() => {
  //   console.log('Selected Difficulty:', selectedDifficulty);
  //   console.log('Selected Quizz Title:', selectedQuizzTitle);
  //   console.log('Selected Time:', selectedTime);
  //   console.log('Selected Question Count:', selectedQuestionCount);
  // }, [selectedDifficulty, selectedQuizzTitle, selectedTime, selectedQuestionCount]);

  return (
    <div className="px-48 mt-24">
      <p className="italicNos text-white text-4xl tracking-wider">Exemples de quizz rapide</p>
      <div className="grid grid-cols-3 gap-4">
        {quizData.map((quiz, index) => (
          <BoxQuizz key={index} title={quiz.title} description={quiz.description} isQuizzRapide />
        ))}
      </div>
    </div>
  );
};

export default QuizzRapide;
