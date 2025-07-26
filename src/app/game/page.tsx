'use client'; 
import { useState, useEffect, useRef } from 'react';

const cards = ['🐶', '🐱', '🐵', '🦁', '🐸', '🐰']; 

const shuffleCards = () => {
  const pairs = [...cards, ...cards];
  return pairs.sort(() => Math.random() - 0.5);
};


export default function GamePage() {
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    setDeck(shuffleCards());
    // const timer = setInterval(() => {
    timeRef.current = setInterval(() => {
        setTime((t) => t+1 );
    }, 1000);

    return () =>{
        if(timeRef.current) clearInterval(timeRef.current);
    };
  }, []);

  useEffect(() => {
    if(matched.length === deck.length && deck.length > 0){
        setGameWon(true);
        if(timeRef.current){
            clearInterval(timeRef.current);
        }
    }
  }, [matched, deck]);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (deck[first] === deck[second]) {
        setMatched((prev) => [...prev, first, second]);
        setScore((s) => s+1);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
   
    <main className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
            <h1 className="text-lg sm:text-xl font-bold">Score: {score}</h1>
            <h1 className="text-lg sm:text-xl font-bold">Time: {time}s</h1>
        </div>

        {gameWon ? (
            <div className="text-center mt-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">🎉 You Won!</h2>
                <p className="text-base sm:text-lg">Score: {score} | Time: {time} seconds</p>
            </div>
        ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 justify-items-center">
                {deck.map((card, i) => {
                    const isFlipped = flipped.includes(i) || matched.includes(i);
                    return (
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            className={`w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl rounded ${
                                isFlipped ? 'bg-green-500' : 'bg-blue-500'
                            } text-white flex items-center justify-center`}
                        >
                            {isFlipped ? card : '❓'}
                        </button>
                    );
                })}
            </div>
        )}
    </main>
  );
}
