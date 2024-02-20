import { useSearchParams } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { SocketContext } from "@/app/socketContext";
import { useRouter } from "next/navigation";
import { useRooms } from "@/app/quizz/RoomsContext";


const MaRoom = () => {
    const searchParams = useSearchParams();
    const [haveRoom, setHaveRoom] = useState(false);
    const socket = useContext(SocketContext);
    const router = useRouter();
    const { maRoom, setMaRoom } = useRooms();


    useEffect(() => {
        const selectedDifficulty = searchParams.get("selectedDifficulty");
        const selectedQuestionCount = searchParams.get("selectedQuestionCount");
        const selectedQuizzTitle = searchParams.get("selectedQuizzTitle");
        const selectedTime = searchParams.get("selectedTime");
        
    
        if (selectedDifficulty && selectedQuestionCount && selectedQuizzTitle && selectedTime) {
            setHaveRoom(true);
        }
    }, [searchParams]);


    socket.on("room", (room: any) => {
        console.log("quelqu'une est parti")
        setMaRoom(room);
      });


    console.log(maRoom);


    if(socket.connected == false){
       router.push('/quizz')
    }

  return (
    <div className="flex flex-col px-80 mt-24">
        <p className="text-white italicNos text-4xl">Ma room</p>
        {maRoom ? (
            <div className="flex justify-between bg-white rounded-lg bg-linear2 items-center px-12 py-6 gap-40 mt-8">
                <div className="flex flex-col gap-2 text-white">
                    <p className="fontspring text-2xl">{maRoom.theme}</p>
                    <p className="italicNos">{maRoom.nbQuestions} questions</p>
                    <p className="italicNos">{maRoom.timeQuestions} s/questions</p>
                    <div className="rounded-full bg-green-900 py-1 px-3 text-center">
                        <p className="fontspring text-xs text-green-400">{maRoom.difficulty}</p>
                    </div>
                </div>

                <div className="flex gap-4 user">
                    {maRoom.clients.map((client: any, index: number) => (
                    <div key={index} className="flex flex-col items-center justify-center gap-4 fontspring text-white">
                        <div className="border border-1 border-white rounded-lg py-1 px-5 text-center">
                        <p className="text-sm">{client.username}</p>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="flex flex-col items-end justify-between gap-12">
                    <p className="text-4xl text-white fontspring">1 sur 12</p>
                    <div className="flex flex-col gap-3">

                    <div className="px-10 py-2 bg-linear border border-1 border-white rounded-lg text-white">
                        <p className="">Commencer</p>
                    </div>
                    <div className="px-10 py-2 border border-1 border-white rounded-lg text-white text-center">
                        <p className="">Quitter</p>
                    </div>

                    </div>
                </div>
            </div>
        ) : (
        <div className="flex flex-col bg-white fontspring rounded-lg bg-transparent border border-1 border-white items-center px-12 py-6 gap-4 mt-8">
            <p className="text-lg text-white">Vous n’avez pas de rooms...</p>
            <div className="bg-point px-5 py-2 rounded-lg border border-1 border-white">
                <p className="text-white text-md">Creer un quizz</p>
            </div>
        </div>
        )}
       

    </div>
  );
};

export default MaRoom;
