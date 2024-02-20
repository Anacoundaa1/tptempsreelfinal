"use client";
import Header from "./components/Header";
import ContenuPrincipal from "./components/ContenuPrincipal";
import QuizzRapide from "./components/QuizzRapide";
import { PreferencesProvider } from './PreferencesContext';
import Connexion from "./components/Connexion";


const Accueil = () => {

  return (
    <div className="bg-img fullscreen-image relative">
      <PreferencesProvider>
          <Header />
          <ContenuPrincipal />
          <QuizzRapide />
          <Connexion />
      </PreferencesProvider>
    </div>
  );
};

export default Accueil;
