
import { usePreferences } from "../PreferencesContext";
import { useContext, useEffect } from "react";
import Link from "next/link";
import { useRooms } from "@/app/quizz/RoomsContext";
import { SocketContext } from "@/app/socketContext";
import { useRouter } from 'next/navigation';  // Import de useRouter



const ContenuPrincipal = () => {
  const { selectedQuizzTitle, selectedDifficulty, selectedTime, selectedQuestionCount } = usePreferences();

  const socket = useContext(SocketContext);
  const { roomDispo, setRoomDispo } = useRooms();
  const router = useRouter(); // Import de useRouter



  const getRooms = () =>{
    console.log('Recup de la room');
    socket.emit('getRooms');
  }

  socket.on("allRooms", (rooms: any) => {
    setRoomDispo(rooms);
  });

  useEffect(() => {
    console.log(roomDispo);
    if (roomDispo.length > 0) {
      router.push(`/quizz/room`);
    }
  }, [roomDispo]);

  return (
    <div className="flex flex-col justify-center items-center mt-12 w-full">
      <p className="italicNos text-white text-4xl tracking-wider">aggrandissez votre culture</p>
      <p className="text-linear text-8xl mt-5 mb-5 fontspring">CulturaQuizz</p>
      <div className="lignePoint flex items-center">
          <div className="point border border-white border-2 rounded-full"></div>
          <div className="ligne w-96 bg-white h-px"></div>
          <div className="point border border-white border-2 rounded-full"></div>
      </div>
      <div className="w-4/12 text-center text-grey sky text-lg mt-12">
          <p className="">Bienvenue dans CulturaQuizz, le quizz qui te permettra de développer ta culture générale et t’amuser avec tes amis pour vous tester !</p>
      </div>

      <div className="mt-10 flex flex-center gap-4">
        <Link
            className="bg-linear px-5 py-3 rounded-lg text-white fontspring text-sm"
            href={{
              pathname: "/quizz/choixquizz",
            }}
          >
          <p>Créer un quizz</p>
        </Link>
        <div
            onClick={getRooms}
            className="box"
            // href={{
            //   pathname: "/quizz/room",
            // }}
          >
            <p className="fontspring px-5 py-3 text-sm text-linear">Rejoindre un quizz</p>
            </div>
      </div>
    </div>
  );
};
  
  export default ContenuPrincipal;
  