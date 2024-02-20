import React, { useEffect } from "react";
import { useCounter } from "../CounterContext";

interface HeaderQuizzProps {
  isVraiQuizz?: boolean;
  question?: string;
  verif?: string;
}

const HeaderQuizz: React.FC<HeaderQuizzProps> = ({ isVraiQuizz, question,verif }) => {
  const { counter, setCounter } = useCounter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isVraiQuizz && question !== "" && verif == '0') {
      interval = setInterval(() => {
        setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isVraiQuizz, question, setCounter, verif]);

  return (
    <div className="relative">
      {isVraiQuizz && question !== "" && verif == '0' ? (
        <div className="absolute top-10 left-10 right-0 h-20 w-20 bg-transparent border boder-1 border-violet-700 rounded-full flex justify-center items-center">
          <p className="text-white italicNos text-4xl">{counter}</p>
        </div>
      ) : (
        <div></div>
      )}

      <header className="flex justify-center items-center w-full py-12">
        <div className="flex">
          <p className="fontspring text-5xl text-linear">CulturaQuizz</p>
        </div>
      </header>
    </div>
  );
};

export default HeaderQuizz;