import { useEffect, useState, useContext } from "react";

import {SocketContext} from "../../socketContext"; // Importez votre contexte du socket

const Connexion = () => {

  const [estConnectee, setEstConnectee] = useState(false);
  const [username, setUsername] = useState("");

  // Utilisez le hook useContext pour accéder au contexte du socket
  const socket: any | undefined = useContext(SocketContext);

  const changeUtilisateur = () => {
    console.log("called");
    setEstConnectee(true);
    if (socket) {

      socket.auth = { username, point: 0 };
      socket.connect();
      socket.on("connect", () => {
        console.log("connecté");
      });
    }
  };

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value);
  };

  return (
    <div className={estConnectee ? "hidden" : ""}>
      <div className="absolute top-0 bg-black opacity-50 min-h-screen	 w-full flex justify-center items-center">
      </div>
      <div className="!absolute left-1/3 top-1/3	 right-1/3 z-50 w-4/12 rounded-lg bg-point px-10 border border-1 border-white">
        <div className="flex flex-col items-center justify-center py-10 gap-12">
          <div className="flex flex-col items-center">
            <p className="text-linear nostalgic text-4xl text-center">
              Veuillez entrer votre pseudo
            </p>
            <input
              type="text"
              className=" px-4 text-black mt-4 rounded-lg h-10 w-6/12 fontspring"
              defaultValue={""}
              onChange={handleUsernameChange}
            />
            <input
              onClick={() => changeUtilisateur()}
              type="button"
              className="text-white bg-linear mt-4 rounded-lg h-10 w-6/12 cursor-pointer fontspring"
              defaultValue={"Enregistrer"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
