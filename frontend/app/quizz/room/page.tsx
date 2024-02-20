"use client";

import { useEffect, useState,useContext } from "react";
import Header from "../components/Header";
import JoinRoom from "../components/JoinRoom";
import MaRoom from "../components/MaRoom";

const Room = () => {
  
  return (
    <div className="bg-img fullscreen-image relative">
        <Header />
        <MaRoom/>
        <JoinRoom />
    </div>
  );
};

export default Room;
