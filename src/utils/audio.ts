let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  peakGain: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startOffset);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(
    peakGain,
    ctx.currentTime + startOffset + 0.03
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + startOffset + duration
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration + 0.05);
}

/**
 * Calm, dignified acoustic chime suitable for quiet university exam halls.
 */
export function playExamChime(kind: 'start' | 'warning' | 'critical' | 'complete') {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (kind === 'start') {
    playTone(ctx, 523.25, 0, 0.45, 0.09); // C5
    return;
  }

  if (kind === 'warning') {
    // Gentle two-note fifth interval (D5 -> A5)
    playTone(ctx, 587.33, 0, 0.65, 0.11);
    playTone(ctx, 880.0, 0.24, 0.85, 0.1);
    return;
  }

  if (kind === 'critical') {
    // Clear, measured double bell cue (E5 -> E5)
    playTone(ctx, 659.25, 0, 0.5, 0.12);
    playTone(ctx, 659.25, 0.35, 0.65, 0.12);
    return;
  }

  // Completion: dignified three-note descending academic chime (A5 -> F#5 -> D5)
  playTone(ctx, 880.0, 0, 0.75, 0.13);
  playTone(ctx, 739.99, 0.32, 0.75, 0.13);
  playTone(ctx, 587.33, 0.64, 1.35, 0.15);
}
