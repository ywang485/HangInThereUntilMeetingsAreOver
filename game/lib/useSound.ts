'use client';

import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'click' | 'heartRestored' | 'relationIncreased' | 'relationDecreased';

/**
 * Hook for playing game sounds using Web Audio API
 */
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on client side only
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playTone = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, []);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 0.2);
  }, [playTone]);

  const playHeartRestored = useCallback(() => {
    // Happy ascending notes
    playTone(523, 0.1, 0.2); // C
    setTimeout(() => playTone(659, 0.1, 0.2), 100); // E
    setTimeout(() => playTone(784, 0.15, 0.2), 200); // G
  }, [playTone]);

  const playRelationIncreased = useCallback(() => {
    // Positive chirp
    playTone(600, 0.08, 0.2);
    setTimeout(() => playTone(800, 0.12, 0.2), 80);
  }, [playTone]);

  const playRelationDecreased = useCallback(() => {
    // Negative descending tone
    playTone(400, 0.08, 0.2);
    setTimeout(() => playTone(300, 0.12, 0.2), 80);
  }, [playTone]);

  const playSound = useCallback((type: SoundType) => {
    switch (type) {
      case 'click':
        playClick();
        break;
      case 'heartRestored':
        playHeartRestored();
        break;
      case 'relationIncreased':
        playRelationIncreased();
        break;
      case 'relationDecreased':
        playRelationDecreased();
        break;
    }
  }, [playClick, playHeartRestored, playRelationIncreased, playRelationDecreased]);

  return { playSound };
}
