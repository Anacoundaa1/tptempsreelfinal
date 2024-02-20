// app/layout.tsx
import './globals.css'
import { SocketContextProvider } from './socketContext';
import { RoomsProvider } from "@/app/quizz/RoomsContext";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <SocketContextProvider>
          <RoomsProvider>
          {children}
          </RoomsProvider>
          </SocketContextProvider>
      </body>
    </html>
  );
}
