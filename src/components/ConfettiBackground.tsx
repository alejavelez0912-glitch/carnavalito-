import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

const COLORS = [
  "hsl(45 100% 50%)",   // yellow
  "hsl(160 70% 40%)",   // green
  "hsl(0 75% 55%)",     // red
  "hsl(30 95% 55%)",    // orange
  "hsl(280 60% 50%)",   // purple
];

const ConfettiBackground = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 8 + Math.random() * 12,
        rotation: Math.random() * 360,
      });
    }
    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute opacity-60"
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s infinite`,
            borderRadius: "2px",
          }}
        />
      ))}
      
      {/* Decorative circles */}
      <div 
        className="absolute top-10 left-5 w-32 h-32 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, hsl(45 100% 50%), transparent)" }}
      />
      <div 
        className="absolute top-20 right-10 w-24 h-24 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(0 75% 55%), transparent)" }}
      />
      <div 
        className="absolute bottom-40 left-10 w-20 h-20 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, hsl(160 70% 40%), transparent)" }}
      />
    </div>
  );
};

export default ConfettiBackground;
