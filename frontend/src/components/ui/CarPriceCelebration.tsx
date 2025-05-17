// CarPriceCelebration.tsx
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

type Props = {
  price: number;
};

export default function CarPriceCelebration({ price }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!price) return;
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, [price]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-2xl h-screen max-h-[486px]">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <motion.h1
        key={price}
        className="text-4xl font-bold text-green-600"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        ₹{price.toLocaleString()}
      </motion.h1>

      <p className="text-gray-700 mt-2 text-sm uppercase tracking-wide">
        DO Do Dooo ! Here's your estimated price.
      </p>
    </div>
  );
}
