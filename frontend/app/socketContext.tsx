// app/socketContext.tsx
// Marquer le composant comme un composant côté client
'use client';

import { createContext, useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';



const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  withCredentials: true,
  autoConnect: false,
  upgrade: false,
  extraHeaders: {
    'Access-Control-Allow-Origin': 'http://localhost:3001',
  },
});

export const SocketContext = createContext<typeof socket>(socket);

export const SocketContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
