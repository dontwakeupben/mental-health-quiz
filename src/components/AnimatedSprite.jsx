import React, { useState, useEffect, useRef, useMemo } from 'react';

// Import all sprite rotations
const spriteRotations = {
  south: '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/south.png',
  'south-east': '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/south-east.png',
  east: '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/east.png',
  'north-east': '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/north-east.png',
  north: '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/north.png',
  'north-west': '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/north-west.png',
  west: '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/west.png',
  'south-west': '/A_small_kid_wearing_flipflops_and_a_white_singlet/rotations/south-west.png',
};

const directionOrder = [
  'south',
  'south-east',
  'east',
  'north-east',
  'north',
  'north-west',
  'west',
  'south-west',
];

/**
 * AnimatedSprite - An 8-directional sprite with walking/breathing animation
 * 
 * @param {Object} props
 * @param {string} props.direction - Initial direction ('south', 'east', etc.)
 * @param {boolean} props.isWalking - Whether the sprite is walking (triggers bobbing animation)
 * @param {boolean} props.autoRotate - Whether to automatically rotate through directions
 * @param {number} props.rotationInterval - Milliseconds between direction changes when auto-rotating
 * @param {string} props.size - Size class for the sprite (default: 'w-24 h-24')
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedSprite = ({
  direction = 'south',
  isWalking = true,
  autoRotate = true,
  rotationInterval = 800,
  size = 'w-24 h-24',
  className = '',
}) => {
  const [rotationTick, setRotationTick] = useState(0);
  const [bobOffset, setBobOffset] = useState(0);
  const animationRef = useRef(null);
  const rotationRef = useRef(null);

  // Calculate current direction based on mode
  const currentDirection = useMemo(() => {
    if (autoRotate) {
      const startIndex = directionOrder.indexOf(direction);
      return directionOrder[(startIndex + rotationTick) % directionOrder.length];
    }
    return direction;
  }, [autoRotate, direction, rotationTick]);

  // Walking/breathing animation loop
  useEffect(() => {
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (isWalking) {
        // Walking bob: faster, more pronounced
        const bobFrequency = 0.008;
        const bobAmount = 4;
        const newBobOffset = Math.sin(elapsed * bobFrequency) * bobAmount;
        setBobOffset(newBobOffset);
      } else {
        // Idle breathing: slower, subtler
        const breathFrequency = 0.003;
        const breathAmount = 2;
        const newBobOffset = Math.sin(elapsed * breathFrequency) * breathAmount;
        setBobOffset(newBobOffset);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isWalking]);

  // Auto-rotation through directions
  useEffect(() => {
    if (autoRotate) {
      rotationRef.current = setInterval(() => {
        setRotationTick((prev) => (prev + 1) % directionOrder.length);
      }, rotationInterval);
    }

    return () => {
      if (rotationRef.current) {
        clearInterval(rotationRef.current);
      }
    };
  }, [autoRotate, rotationInterval]);

  return (
    <div className={`relative inline-flex flex-col items-center justify-end ${className}`}>
      {/* Sprite */}
      <div
        className={`relative ${size} transition-all duration-75`}
        style={{
          transform: `translateY(${bobOffset}px)`,
        }}
      >
        <img
          src={spriteRotations[currentDirection]}
          alt={`Character facing ${currentDirection}`}
          className="w-full h-full object-contain pixel-art"
        />
      </div>
    </div>
  );
};

export default AnimatedSprite;
