import fleche from "../../images/arrow.png";
import { usePreferences } from "../PreferencesContext";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';  // Import de useRouter

import { useRooms } from "@/app/quizz/RoomsContext";


import { SocketContext } from "@/app/socketContext";

interface Props {
  theme: boolean;
  setTheme: (theme: boolean) => void;
}

const goQuizz = () => {
  console.log("GO");
};

const SettingHeader = ({ theme, setTheme }: Props) => {
  const socket = useContext(SocketContext);
  const { roomDispo, setRoomDispo } = useRooms();
  const { maRoom, setMaRoom } = useRooms();
  // const [roomDispo, setRoomDispo] = useState<any[]>([]);
  const router = useRouter(); // Import de useRouter

  const {
    preferences,
    selectedDifficulty,
    selectedQuestionCount,
    selectedTime,
    selectedQuizzTitle,
  } = usePreferences();

  const createRoom = () => {
    console.log('Création de la room en cours...');
    socket.emit('createRoom', preferences);
  };

  socket.on("allRooms", (rooms: any) => {
    setRoomDispo(rooms);
  });

  socket.on("room", (room: any) => {
    console.log(room);
    setMaRoom(room);
  });

  
  

  useEffect(() => {
    console.log(roomDispo);
    console.log(maRoom);
    if (roomDispo.length > 0 && maRoom != undefined) {
      router.push(`/quizz/room?selectedDifficulty=${maRoom.difficulty}&selectedQuizzTitle=${maRoom.theme}&selectedQuestionCount=${maRoom.nbQuestions}&selectedTime=${maRoom.timeQuestionss}`);
    }
  }, [roomDispo, router,maRoom]);

  return (
    <div className="mt-24 flex justify-between items-center w-full">
      {theme ? (
        <p className="italicNos text-white text-4xl tracking-wider">
          Veuillez sélectionner un thème
        </p>
      ) : (
        <p className="italicNos text-white text-4xl tracking-wider">
          Veuillez sélectionner vos préférences
        </p>
      )}

      {selectedDifficulty && theme ? (
        <div
          className="box flex px-5 py-3 w-2/12 justify-between cursor-pointer"
          onClick={() => (theme ? setTheme(!theme) : goQuizz())}
        >
          <p className="text-white fontspring">Continuer</p>
          <img src={fleche.src} alt="Image d'une fleche" />
        </div>
      ) : selectedQuestionCount && selectedTime ? (
        <div
          onClick={() => createRoom()}
          className="box flex px-5 py-3 w-2/12 justify-between cursor-pointer"
        >
          <p className="text-white fontspring">Créer le quizz</p>
          <img src={fleche.src} alt="Image d'une fleche" />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SettingHeader;
