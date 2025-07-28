import React from 'react';
import { motion } from 'framer-motion';

const Confetti = () => {
  const confettiPieces = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1,
    duration: 4 + Math.random() * 3,
    color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FF9FF3', '#54A0FF', '#5F27CD', '#FF3838', '#00D2FF', '#FFA8E4', '#FFD93D', '#6BCF7F'][Math.random() * 15 | 0],
    size: 10 + Math.random() * 12
  }));

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 9999,
      overflow: "hidden"
    }}>
      {/* Success celebration text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "32px",
          fontWeight: "800",
          color: "#FFD700",
          textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
          zIndex: 10000
        }}
      >
        🎉 Task Completed! 🎉
      </motion.div>

      {confettiPieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ 
            y: -10, 
            x: `${piece.left}vw`, 
            rotate: 0,
            scale: 0
          }}
          animate={{ 
            y: "100vh", 
            rotate: 360,
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut"
          }}
          style={{
            position: "absolute",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px"
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;