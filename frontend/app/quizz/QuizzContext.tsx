import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from "react";

// Interface pour le contexte du quizz
interface QuizzContextProps {
  quizz: any[]; // Assurez-vous de définir le type correct pour votre quizz
  setQuizz: Dispatch<SetStateAction<any[]>>;
}

// Créez le contexte avec une valeur par défaut vide
const QuizzContext = createContext<QuizzContextProps | undefined>(undefined);

// Créez le fournisseur qui encapsule l'application
export const QuizzProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizz, setQuizz] = useState<any[]>([]); // Assurez-vous de définir le type correct pour votre quizz

  return (
    <QuizzContext.Provider value={{ quizz, setQuizz }}>
      {children}
    </QuizzContext.Provider>
  );
};

// Créez un hook pour utiliser le contexte du quizz
export const useQuizz = (): QuizzContextProps => {
  const context = useContext(QuizzContext);
  if (!context) {
    throw new Error("useQuizz must be used within a QuizzProvider");
  }
  return context;
};