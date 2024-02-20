import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';

interface TimerProps {
  setCurrentCountdown2: any;
  question: string;
}

const Timer = ({ setCurrentCountdown2, question }: TimerProps) => {
  const [countdown, setCountdown] = useState(['3', '2', '1', '0']);
  const [currentCountdown, setCurrentCountdown] = useState('');

  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout;

    if (question !== "") {
      interval = setInterval(() => {
        setCurrentCountdown('');
        setTimeout(() => {
          setCurrentCountdown(countdown[index]);
          index++;

          if (index === countdown.length) {
            clearInterval(interval);
          }
        }, 100);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countdown, question, setCurrentCountdown2]);

  useEffect(() => {
    setCurrentCountdown2(currentCountdown);
  }, [currentCountdown, setCurrentCountdown2]);

  return (
    <div className='relative'>
      {question === "" ? (
        <div className="absolute top-60  left-0 right-0 flex flex-col gap-12 items-center  h-screen">
          <h1 className='text-linear text-5xl fontspring'>Chargement du quizz en cours...</h1>
          <SyncLoader color="#EF9FFD" loading={true} size={15} margin={2} />
        </div>
      ) : (
        <>
          <div className="relative flex flex-col text-linear justify-center items-center top-72">
            {currentCountdown && currentCountdown !== '0' && (
              <p className="countdown-item text-linear fontspring">
                {currentCountdown}
              </p>
            )}
          </div>
          {currentCountdown !== '0' && (
            <p className='absolute text-linear text-9xl fontspring top-40 left-0 right-0 text-center'>
              ATTENTION...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Timer;