

import BoxQuizz from "../components/BoxQuizz";

const ListQuizz = () => {

  const quizData = [
    {
      title: "Animaux",
      description: "Un quiz pour tester vos connaissances sur le règne animal. ROOOAR !"
    },
    {
      title: "Pays",
      description: "Un quiz pour découvrir des faits intéressants sur différents pays du monde."
    },
    {
      title: "Capitales",
      description: "Testez vos connaissances sur les capitales du monde avec ce quiz captivant."
    },
    {
      title: "Voitures",
      description: "Un quiz pour les passionnés d'automobiles. Devinez les marques et les modèles !"
    },
    {
      title: "Histoire",
      description: "Explorez l'histoire du monde à travers ce quiz fascinant. Vous pourrez tester votre savoir !"
    },
    {
      title: "Cuisine",
      description: "Découvrez des questions sur la cuisine du monde entier dans ce quiz gastronomique."
    },
    {
      title: "Science",
      description: "Testez vos connaissances scientifiques avec ce quiz stimulant. Etes-vous un vrai scientifique ?"
    },
    {
      title: "Musique",
      description: "Reconnaissez-vous les chansons et les artistes dans ce quiz musical ?"
    },
    {
      title: "Cinéma",
      description: "Un quiz pour les amateurs de cinéma. Devinez les films, les acteurs et les réalisateurs !"
    },
    {
      title: "Géographie",
      description: "Explorez le monde avec des questions de géographie dans ce quiz instructif."
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">

      {quizData.map((quiz, index) => (
        <BoxQuizz key={index} title={quiz.title} description={quiz.description} />
      ))}
    </div>
  );
};

export default ListQuizz;
