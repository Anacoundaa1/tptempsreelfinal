import { SocketContext } from "@/app/socketContext";
import { useEffect, useState, useContext } from "react";
import { useRooms } from "@/app/quizz/RoomsContext";


interface User {
  id: string;
  username?: string;
  point?: number;
}

interface Room {
  id: string;
  creator: User;
  clients: User[];
  difficulty: string;
  theme: string;
  nbQuestions: number;
  timeQuestions: number;
  quizz?: Question[];
  isStarted: boolean;
}

interface Question {
  id: string;
  question: string;
  possibleAnswers: string[];
  answer: string;
}
const JoinRoom = () => {
  const socket = useContext(SocketContext);
  // const [roomDispo, setRoomDispo] = useState<any[]>([]);
  const { roomDispo, setRoomDispo } = useRooms();
  const { maRoom, setMaRoom } = useRooms();



  useEffect(() => {
    const handleAllRooms = (rooms: any) => {
      console.log(rooms);
      setRoomDispo(rooms);
    };

    // Écoutez l'événement 'allRooms'
    socket.on('allRooms', handleAllRooms);

    console.log("bebe")

    // Émettez l'événement pour demander les rooms lorsque le composant est monté
    socket.emit('get-rooms');

    // Nettoyez l'écouteur lorsque le composant est démonté
    return () => {
      socket.off('allRooms', handleAllRooms);
    };
  }, [setRoomDispo,setMaRoom]);
  

  useEffect(() => {
    console.log("roomDispo changed:", roomDispo);
  }, [roomDispo]);


  const handleJoinRoom = (room : any) => {
    console.log("changement de room");
    socket.emit("joinRoom", room.id);
    socket.on("room", (room: any) => {
      console.log(room);
      setMaRoom(room);
    });
  }

  return (
    <div className="flex flex-col px-80 mt-24">
      <p className="text-white italicNos text-4xl">Room à rejoindre</p>
      
      <div className="grid grid-cols-3 gap-5">
        {roomDispo.map((room:any, index) => (
           (!maRoom || (maRoom && maRoom.id && maRoom.id !== room.id)) ? (
            <div key={index} className="flex bg-white rounded-lg bg-transparent border border-1 border-white items-center px-12 py-6 gap-24 mt-8">
              <div className="flex flex-col gap-2 text-white">
                <p className="fontspring text-2xl">{room.theme}</p>
                <p className="italicNos">{room.nbQuestions} questions</p>
                <p className="italicNos">{room.timeQuestions} s/questions</p>
                <div className="rounded-full bg-green-900 py-1 px-3 text-center">
                  <p className="fontspring text-xs text-green-400">{room.theme}</p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between gap-12">
                <p className="text-4xl text-white fontspring">{index + 1} sur {roomDispo.length}</p>
                <div onClick={() => handleJoinRoom(room)} className="px-10 py-2 border border-1 border-white rounded-lg text-white">
                  <p className="">Rejoindre</p>
                </div>
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default JoinRoom;
