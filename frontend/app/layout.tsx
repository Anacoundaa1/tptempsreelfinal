// app/layout.tsx
"use client"
import './globals.css'
import { SocketContextProvider } from './socketContext';
import { RoomsProvider } from "@/app/quizz/RoomsContext";
import { QuizzProvider } from "@/app/quizz/QuizzContext";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <SocketContextProvider>
          <RoomsProvider>
            <QuizzProvider>
          {children}
          </QuizzProvider>
          </RoomsProvider>
          </SocketContextProvider>
      </body>
    </html>
  );
}
