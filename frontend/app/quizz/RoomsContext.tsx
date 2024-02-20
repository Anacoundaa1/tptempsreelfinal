'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction } from "react";

// Interface pour le contexte des rooms
interface RoomsContextProps {
  roomDispo: any[];
  setRoomDispo: Dispatch<SetStateAction<any[]>>;
  maRoom: any; // Nouvelle variable
  setMaRoom: Dispatch<SetStateAction<any>>; // Nouvelle fonction de mise à jour
}

// Créez le contexte avec une valeur par défaut vide
const RoomsContext = createContext<RoomsContextProps | undefined>(undefined);

// Créez le fournisseur qui encapsule l'application
export const RoomsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roomDispo, setRoomDispo] = useState<any[]>([]);
  const [maRoom, setMaRoom] = useState<any>(null); // Initialisation de maRoom à null

  return (
    <RoomsContext.Provider value={{ roomDispo, setRoomDispo, maRoom, setMaRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

// Créez un hook pour utiliser le contexte
export const useRooms = (): RoomsContextProps => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
};
