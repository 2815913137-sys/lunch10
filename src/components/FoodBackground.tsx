/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const FOOD_EMOJIS = ['🍜', '🍲', '🍕', '🍔', '🍛', '🍣', '🍙', '🥗', '🍱', '🥟', '🍡', '🍉', '🍉', '🧁', '🍦', '☕', '🍓', '🥑'];

interface FoodItem {
  id: number;
  emoji: string;
  x: number; // percentage width
  y: number; // percentage height
  scale: number;
  duration: number;
  delay: number;
}

export default function FoodBackground() {
  const [items, setItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    // Generate stable random food emojis positions on component mount
    const generated = Array.from({ length: 18 }).map((_, id) => ({
      id,
      emoji: FOOD_EMOJIS[id % FOOD_EMOJIS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 0.7,
      duration: 20 + Math.random() * 30, // Slow and smooth drift
      delay: Math.random() * -30, // Negative delay to prevent pop-in on load
    }));
    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.05]">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-5xl"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
          }}
          animate={{
            y: [0, -35, 35, 0],
            x: [0, 25, -25, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
