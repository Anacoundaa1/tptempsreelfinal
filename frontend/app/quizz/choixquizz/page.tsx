"use client";

// app/choixQuizz.tsx

import { useState } from "react";
import HeaderQuizz from "../components/HeaderQuizz";
import ListQuizz from "../components/ListQuizz";
import Preferences from "../components/Preferences";
import SettingHeader from "../components/SettingHeader";
import { PreferencesProvider } from "../PreferencesContext";
import { CounterProvider } from "../CounterContext";
import { useContext } from "react";  // Importez useContext
import {SocketContext} from "@/app/socketContext";
import { useRouter } from "next/navigation";


const ChoixQuizz = () => {
  const [theme, setTheme] = useState(true);

  // Utilisez useContext pour accéder au contexte du socket
  const socket = useContext(SocketContext);

  const router = useRouter();


  if(socket.connected == false){
    return router.push('/quizz') 
}

  console.log(socket);

  return (
    <div className="bg-img fullscreen-image px-48">
      <CounterProvider>
        <PreferencesProvider>
          <HeaderQuizz />
          <p></p>
          <SettingHeader theme={theme} setTheme={setTheme} />

          {theme ? <ListQuizz /> : <Preferences />}
        </PreferencesProvider>
      </CounterProvider>
    </div>
  );
};

export default ChoixQuizz;