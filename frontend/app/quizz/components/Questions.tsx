import React, {useContext, useEffect, useState } from "react";
import Timer from "./Timer";
import HeaderQuizz from "./HeaderQuizz";
import { CounterProvider } from "../CounterContext";
import { useCounter } from "../CounterContext";
import {SocketContext} from "@/app/socketContext";


interface QuestionsProps {
  question: any;
  correctAnswer:string
}

const Questions = ({ question, correctAnswer}: QuestionsProps) => {
  const { counter } = useCounter();
  const [selectedResponse, setSelectedResponse] = useState("");
  const socket = useContext(SocketContext);


  useEffect(() => {

    console.log(correctAnswer);
  }, [correctAnswer]);


  const changeResponse = (response: any) => {
    setSelectedResponse(response);
    socket.emit("selectedAnswer", {
      response,
    });
  };

  return (
    <div className="relative px-48 flex flex-col items-center justify-center mt-24">
      <p className="italicNos text-white text-6xl">{question.question}</p>

      <div className="grid grid-cols-2 gap-24 mt-24 text-center">
        {Object.values(question.reponses).map((response:any, index) => (
          <div
            key={index}
            className={`box mt-4 px-20 py-16  flex flex-col cursor-pointer ${
               response === correctAnswer
                ? "!bg-green-900 rounded-lg"
                : "bg-transparent"
            } ${
              selectedResponse === response
                ? "bg-linear rounded-lg"
                : ""
            }`}
            onClick={() => changeResponse(response)}
          >
            <p className="text-white fontspring text-xl">{response}</p>
          </div>
        ))}
      </div>

      

     
    </div>
    
  );
};

export default Questions;