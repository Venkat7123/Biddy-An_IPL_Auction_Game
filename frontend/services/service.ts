
import { GoogleGenAI } from "@google/genai";

/**
 * Synthetic audio service for auction sound effects.
 * Uses Web Audio API to generate sounds without external assets.
 */
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // A crisp click for bidding
  playBid() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx!.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.1);
  }

  // A heavy gavel/hammer sound for "SOLD"
  playHammer() {
    this.init();
    const now = this.ctx!.currentTime;
    
    // Impact
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(now + 0.4);

    // Crack/Noise
    const noise = this.ctx!.createBufferSource();
    const bufferSize = this.ctx!.sampleRate * 0.1;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const noiseGain = this.ctx!.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.linearRampToValueAtTime(0, now + 0.05);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx!.destination);
    noise.start();
  }

  // A low buzzer for "UNSOLD"
  playUnsold() {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx!.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx!.currentTime + 0.5);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.5);
  }

  // Short tick for timer
  playTick(isCritical: boolean = false) {
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCritical ? 1200 : 800, this.ctx!.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.05);
  }

  // Shimmering sound for RTM trigger
  playRtm() {
    this.init();
    const now = this.ctx!.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.frequency.setValueAtTime(800 + (i * 400), now + (i * 0.05));
      gain.gain.setValueAtTime(0.05, now + (i * 0.05));
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + (i * 0.05));
      osc.stop(now + 0.5);
    }
  }
}

export const audioService = new AudioService();

/**
 * AI Commentary Service using Gemini
 */
export async function getAuctioneerCommentary(playerName: string, bidPrice: number, teamName: string, isSold: boolean = true) {
  const apiKey = process.env.API_KEY;
  const fallback = isSold 
    ? `Hammer down! ${playerName} joins ${teamName} for ₹${bidPrice.toFixed(2)} Cr!` 
    : `${playerName} goes unsold at ₹${bidPrice.toFixed(2)} Cr. Back to the pool.`;
  
  if (!apiKey) return fallback;
  
  const ai = new GoogleGenAI({ apiKey });
  try {
    const prompt = isSold 
      ? `You are a high-energy IPL auctioneer. Give a very short, punchy 1-sentence commentary about ${playerName} being sold to ${teamName} for ₹${bidPrice} Crores. Use cricket terminology and excitement.`
      : `You are a high-energy IPL auctioneer. Give a very short, punchy 1-sentence commentary about ${playerName} going UNSOLD at his base price of ₹${bidPrice} Crores. Use cricket terminology and a touch of drama.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || (isSold ? `${playerName} SOLD!` : `${playerName} UNSOLD!`);
  } catch (error: any) {
    // Specifically handle quota exceeded errors to prevent app disruption
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429')) {
      console.warn("Gemini Quota Exceeded. Using static commentary.");
    } else {
      console.error("Gemini Error:", error);
    }
    return fallback;
  }
}
