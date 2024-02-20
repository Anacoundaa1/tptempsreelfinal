import { useEffect, useState } from "react";
import Timer from "./Timer";
import HeaderQuizz from "./HeaderQuizz";
import Questions from "./Questions";
import { CounterProvider } from "../CounterContext";

interface VraiQuizzProps {
  question: string;
  correctAnswer:string;
}

const VraiQuizz = ({ question,correctAnswer }: VraiQuizzProps) => {
  const [currentCountdown, setCurrentCountdown] = useState("");
  const [verif, setVerif] = useState("");

  useEffect(() => {
    setVerif(currentCountdown);
  }, [currentCountdown]);

  return (
    <CounterProvider>
      <div className="relative">
        <HeaderQuizz isVraiQuizz verif={verif} question={question} />
        {question == '' ? (
          <Timer setCurrentCountdown2={setCurrentCountdown} question={question} />
        ) : (
          <Questions question={question} correctAnswer={correctAnswer}/>
        )}
      </div>
    </CounterProvider>
  );
};

export default VraiQuizz;
