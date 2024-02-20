// "use client"
// import { PreferencesProvider } from "../PreferencesContext";
// import VraiQuizz from "../components/VraiQuizz";
// import React, { useContext, useEffect, useState } from "react";
// import socketContext from "../../socketContext";
// import { useSearchParams } from "next/navigation";
// import Points from "../components/Points";
// import { useRouter } from 'next/navigation';


// // Définissez le composant Accueil
// const Accueil = () => {

//   const router = useRouter();
//   // Utilisez useSearchParams pour obtenir les paramètres de l'URL
//   const searchParams = useSearchParams();
  
//   // Utilisez le contexte du socket
//   const socket = useContext(socketContext);
  
//   // State pour stocker la question
//   const [question, setQuestion] = useState<string>("");

//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [responseTime, setResponseTime] = useState(0);

//   const [scoreArray, setScoreArray] = useState<number[]>([]);

//   const [scoreTotal, setScoreTotal] = useState(0);

//   const handleAnswerSubmitted = (data: { correctAnswer: string , userResponseTime : number}) => {

//     console.log(data.correctAnswer);
//     setCorrectAnswer(data.correctAnswer);
//     setResponseTime(data.userResponseTime);
//     if (data.userResponseTime == null){
//       const score = 0;
//     }
//     const score = (10 - data.userResponseTime)*99;
//     setScoreTotal(scoreTotal+score);
//     scoreArray.push(score);
//     console.log(responseTime);


//     // Réinitialiser l'état de la bonne réponse après un court délai
//     setTimeout(() => {
//       setCorrectAnswer("");
//     }, 5000);
//   };


  
//   // Effet useEffect pour gérer la logique lorsqu'un socket est disponible
//   useEffect(() => {

//     // Vérifiez si le socket est disponible
//     if (!socket) return;

//     // Obtenez les paramètres de l'URL
//     const selectedDifficulty = searchParams.get("selectedDifficulty");
//     const selectedQuestionCount = searchParams.get("selectedQuestionCount");
//     const selectedQuizzTitle = searchParams.get("selectedQuizzTitle");
//     const selectedTime = searchParams.get("selectedTime");

//     socket.emit("connected", {
//       selectedDifficulty,
//       selectedQuestionCount,
//       selectedQuizzTitle,
//       selectedTime,
//     });

//     console.log("ok1")
//     // Écoutez l'événement 'newQuestion' pour recevoir les questions du backend
//     socket.on("newQuestion", (data: { question: string }) => {
//       console.log("Received newQuestion event:", data);
//       setQuestion(data.question);
//       console.log(data.question);
//     });

//     socket.on("answerSubmitted", handleAnswerSubmitted);

//     // Nettoyez les écouteurs d'événements si nécessaire
//     return () => {
//       socket.off("newQuestion");
//       socket.off("answerSubmitted", handleAnswerSubmitted);
//       if (socket.connected) {
//         socket.disconnect();
//       }
//     };
//   }, [socket, searchParams]);

//   // Rendu du composant
//   return (
//     <div className="relative bg-img fullscreen-image">
//       {/* Wrappez le composant VraiQuizz avec PreferencesProvider */}
//       <PreferencesProvider>
//         <VraiQuizz question={question}  correctAnswer={correctAnswer} />
//        {
//         question =="" ? (
//           <Points scoreTotal={scoreTotal} scoreArray={scoreArray}/>
//         ) : (
//           <div></div>
//         )
//        } 
        
//       </PreferencesProvider>
//     </div>
//   );
// };

// // Exportez le composant Accueil par défaut
// export default Accueil;
