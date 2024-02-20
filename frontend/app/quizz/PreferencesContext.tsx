import { createContext, useContext, useState, ReactNode } from 'react';

type PreferencesContextType = {
  selectedDifficulty: string;
  setDifficulty: (difficulty: string) => void;
  selectedQuizzTitle: string;
  setQuizzTitle: (title: string) => void;
  selectedTime: number;
  setTime: (time: number) => void;
  selectedQuestionCount: number;
  setQuestionCount: (count: number) => void;
  preferences: {
    selectedDifficulty: string;
    selectedQuizzTitle: string;
    selectedTime: number;
    selectedQuestionCount: number;
  };
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedQuizzTitle, setSelectedQuizzTitle] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<number>(0);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(0);
  const [preferences, setPreferences] = useState({
    selectedDifficulty: '',
    selectedQuizzTitle: '',
    selectedTime: 0,
    selectedQuestionCount: 0,
  });

  const setDifficulty = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setPreferences((prev) => ({ ...prev, selectedDifficulty: difficulty }));
  };

  const setQuizzTitle = (title: string) => {
    setSelectedQuizzTitle(title);
    setPreferences((prev) => ({ ...prev, selectedQuizzTitle: title }));
  };

  const setTime = (time: number) => {
    setSelectedTime(time);
    setPreferences((prev) => ({ ...prev, selectedTime: time }));
  };

  const setQuestionCount = (count: number) => {
    setSelectedQuestionCount(count);
    setPreferences((prev) => ({ ...prev, selectedQuestionCount: count }));
  };

  return (
    <PreferencesContext.Provider value={{ selectedDifficulty, setDifficulty, selectedQuizzTitle, setQuizzTitle, selectedTime, setTime, selectedQuestionCount, setQuestionCount, preferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};