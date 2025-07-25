'use client'; 
import { useState, useEffect } from 'react';

const cards = ['🐶', '🐱', '🐵', '🦁', '🐸', '🐰']; 

const shuffleCards = () => {
  const pairs = [...cards, ...cards];
  return pairs.sort(() => Math.random() - 0.5);
};


export default function GamePage() {
  const [deck, setDeck] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    setDeck(shuffleCards());
  }, []);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (deck[first] === deck[second]) {
        setMatched([...matched, first, second]);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  };

  return (
    <main className="grid grid-cols-4 gap-4 p-10">
      {deck.map((card, i) => {
        const isFlipped = flipped.includes(i) || matched.includes(i);
        return (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-20 h-20 text-2xl bg-blue-500 text-white rounded"
          >
            {isFlipped ? card : '❓'}
          </button>
        );
      })}
    </main>
  );
}
