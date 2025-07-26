"use client";
import React, { useEffect, useState, useRef } from "react";

const cards = ["🍎", "🍌", "🍇", "🍒", "🍉", "🥝", "🍍", "🍑"];

const shuffleCards = () => {
  const doubled = [...cards, ...cards];
  return doubled
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false }));
};

export default function MemoryGame() {
  const [deck, setDeck] = useState(shuffleCards());
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (matched.length === deck.length && deck.length > 0) {
      setGameWon(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [matched, deck]);

  const handleClick = (index: number) => {
    if (selected.length === 2 || selected.includes(index) || matched.includes(index)) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setScore((prev) => prev + 1);

      const [firstIdx, secondIdx] = newSelected;
      if (deck[firstIdx].emoji === deck[secondIdx].emoji) {
        setMatched((prev) => [...prev, firstIdx, secondIdx]);
        setSelected([]);
      } else {
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  const restartGame = () => {
    setDeck(shuffleCards());
    setSelected([]);
    setMatched([]);
    setScore(0);
    setTime(0);
    setGameWon(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  p-4">
      <h1 className="text-3xl font-bold mb-2">Memory Match Game 🧠</h1>
      <div className="text-lg mb-2">⏱ Time: {time} seconds</div>
      <div className="text-lg mb-4">🎯 Score: {score}</div>

      <div className="grid grid-cols-4 gap-4">
        {deck.map((card, index) => {
          const isFlipped = selected.includes(index) || matched.includes(index);
          return (
            <button
              key={card.id}
              onClick={() => handleClick(index)}
              className={`w-16 h-16 text-2xl rounded shadow flex items-center justify-center ${
                isFlipped ? "bg-white" : "bg-gray-400"
              }`}
            >
              {isFlipped ? card.emoji : "❓"}
            </button>
          );
        })}
      </div>

      {gameWon && (
        <div className="mt-6 text-green-600 font-semibold text-xl">🎉 You won in {time} seconds with a score of {score}!</div>
      )}

    <button
      onClick={restartGame}
      className={`mt-6 px-4 py-2 rounded text-white ${
        gameWon ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {gameWon ? "Play Again" : "Restart Game"}
    </button>
    </main>
  );
}
