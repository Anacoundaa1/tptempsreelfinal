interface PointsProps {
    scoreArray: any;
    scoreTotal:any;
  }

const Points = ({scoreArray,scoreTotal} : PointsProps) => {

  return (
    <div>
        <div className="absolute top-0 bg-black opacity-50 min-h-screen	 w-full flex justify-center items-center">
        </div>
        <div className="!absolute left-1/3 top-1/3	 right-1/3 z-50 w-4/12 rounded-lg box bg-point">
          <div className="flex flex-col items-center justify-center py-10 gap-12">
            <div className="flex flex-col items-center">
              <p className="text-linear nostalgic text-4xl">points récoltés</p>
              <p className="text-linear fontspring text-7xl">{scoreArray} points</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-linear nostalgic text-4xl">votre score total</p>
              <p className="text-linear fontspring text-7xl">{scoreTotal} points</p>
            </div>
          </div>
              
          </div>
            
    </div>
  );
};

// Exportez le composant Accueil par défaut
export default Points;
