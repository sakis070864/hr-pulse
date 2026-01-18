
import React, { useState, useEffect, useRef } from 'react';
import { InterviewQuestion } from '../types';
import { getGeminiClient, encode, decode, decodeAudioData } from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

interface SimulationViewProps {
  question: InterviewQuestion;
  jobTitle: string;
  onBack: () => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ question, jobTitle, onBack }) => {
  const [status, setStatus] = useState<'IDLE' | 'PERMISSIONS' | 'CONNECTING' | 'ACTIVE' | 'ERROR'>('IDLE');
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startSimulation = async () => {
    setStatus('PERMISSIONS');
    
    try {
      // 1. Προτεραιότητα στο Μικρόφωνο
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true } 
      });
      streamRef.current = stream;
      
      setStatus('CONNECTING');

      // 2. Ενεργοποίηση Ήχου (Κρίσιμο για να ακουστεί ο "Coach")
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      if (outCtx.state === 'suspended') await outCtx.resume();
      outputAudioContextRef.current = outCtx;

      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inCtx;

      // 3. Σύνδεση με Gemini
      const ai = getGeminiClient();
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('ACTIVE');
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              
              sessionPromise.then((session) => {
                if (inCtx.state === 'closed') return;
                try {
                  session.sendRealtimeInput({ 
                    media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
                  });
                } catch (e) {
                  // Ignore errors during shutdown
                }
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Transcription
            if (message.serverContent?.outputTranscription) {
              setTranscript(prev => [...prev.slice(-4), `Coach: ${message.serverContent?.outputTranscription?.text}`]);
            }

            // Audio Playback
            const audioPart = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData);
            if (audioPart?.inlineData?.data && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const buffer = await decodeAudioData(decode(audioPart.inlineData.data), ctx);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => { setStatus('ERROR'); console.error(e); },
          onclose: () => setStatus('IDLE')
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are an elite HR Director. 
          Start the interview for ${jobTitle} by asking: "${question.question}". 
          Listen to the candidate and provide challenging follow-up questions.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      setStatus('ERROR');
      console.error(err);
    }
  };

  const endSimulation = () => {
    // 1. Clean up Input Audio (Stop recording immediately)
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
    }

    // 2. Clean up Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    // 3. Clean up Session
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }

    // 4. Clean up Output Audio
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close().catch(() => {});
      outputAudioContextRef.current = null;
    }
    
    // 5. Clear sources
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();

    onBack();
  };

  return (
    <div className="max-w-3xl mx-auto glass p-10 rounded-[2.5rem] border border-white/10 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="mb-12 relative">
        <div className={`w-32 h-32 rounded-full accent-gradient flex items-center justify-center shadow-2xl transition-all duration-500 ${status === 'ACTIVE' ? 'scale-110 shadow-indigo-500/50' : ''}`}>
          {status === 'ACTIVE' ? (
            <div className="flex items-center gap-1">
              {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-8 bg-white rounded-full animate-pulse" style={{animationDelay: `${i*0.1}s`}}></div>)}
            </div>
          ) : (status === 'CONNECTING' || status === 'PERMISSIONS') ? (
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5V23M8 23h8" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        {status === 'IDLE' && 'Voice Simulation'}
        {status === 'ACTIVE' && 'Coach is Listening...'}
        {status === 'CONNECTING' && 'Connecting...'}
        {status === 'ERROR' && 'Connection Error'}
      </h2>
      
      <p className="text-gray-400 mb-10 max-w-sm">
        {status === 'IDLE' && 'Practice your response via voice. The AI will challenge your answers.'}
        {status === 'ACTIVE' && 'Speak clearly. The coach will respond in real-time.'}
      </p>

      {status === 'ACTIVE' && (
        <div className="w-full bg-white/5 p-6 rounded-2xl mb-8 text-left border border-white/5">
          <div className="space-y-3">
            {transcript.map((t, i) => <p key={i} className="text-sm text-indigo-200 opacity-80 italic">{t}</p>)}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {status === 'IDLE' ? (
          <button onClick={startSimulation} className="px-12 py-4 accent-gradient rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
            Start Voice Interview
          </button>
        ) : (
          <button onClick={endSimulation} className="px-12 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold text-white transition-all">
            Exit Simulation
          </button>
        )}
      </div>
    </div>
  );
};

export default SimulationView;
