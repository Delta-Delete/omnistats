
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Disc, Minimize2 } from 'lucide-react';

// Playlist de démo (Musiques libres de droits - Pixabay)
// Vous pouvez remplacer les URLs par vos propres fichiers hébergés
const PLAYLIST = [
    {
        id: 'track_1',
        title: "Atmosphère : Ville Médiévale",
        artist: "Ambiance",
        url: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=medieval-market-19369.mp3" 
    },
    {
        id: 'track_2',
        title: "Aventure : Terres Sauvages",
        artist: "Épique",
        url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=music-for-video-epic-adventure-cinematic-113883.mp3"
    },
    {
        id: 'track_3',
        title: "Combat : Le Boss",
        artist: "Tension",
        url: "https://cdn.pixabay.com/download/audio/2022/03/23/audio_07b2a04be3.mp3?filename=action-drums-sport-beat-10499.mp3"
    }
];

export const MusicPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false); // Start collapsed
    const [volume, setVolume] = useState(0.3); // 30% volume default
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const currentTrack = PLAYLIST[currentTrackIndex];

    // Handle Volume Change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Handle Auto-Play when track changes (except first load)
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => console.warn("Autoplay blocked", e));
        }
    }, [currentTrackIndex]);

    // Update Progress Bar
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration || 1;
            setProgress((current / duration) * 100);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setProgress(0);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
        setProgress(0);
    };

    const handleEnded = () => {
        nextTrack();
    };

    return (
        <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-in-out font-sans ${isExpanded ? 'w-80' : 'w-12'}`}>
            <audio 
                ref={audioRef} 
                src={currentTrack.url} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* EXPANDED PLAYER */}
            {isExpanded ? (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-2 fade-in relative overflow-hidden group">
                    {/* Background visualizer effect (fake) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-tr from-indigo-900 via-transparent to-purple-900"></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                                <Disc size={20} className="text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate w-48">{currentTrack.title}</h4>
                                <p className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsExpanded(false)} 
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <Minimize2 size={16} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-800 rounded-full mb-4 overflow-hidden relative z-10">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-300 ease-linear" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                            <button onClick={prevTrack} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                                <SkipBack size={16} />
                            </button>
                            <button 
                                onClick={togglePlay} 
                                className="w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg transition-all hover:scale-105"
                            >
                                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                            </button>
                            <button onClick={nextTrack} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                                <SkipForward size={16} />
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={isMuted ? 0 : volume} 
                                onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* COLLAPSED PLAYER (Simple Floating Button) */
                <button 
                    onClick={() => setIsExpanded(true)}
                    className={`w-12 h-12 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:text-white hover:border-indigo-400 hover:bg-indigo-900/20 shadow-lg transition-all duration-300 group relative ${isPlaying ? 'animate-pulse-slow' : ''}`}
                    title="Lecteur de Musique"
                >
                    <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500/50 ${isPlaying ? 'animate-spin' : ''}`}></div>
                    <Music size={20} className="relative z-10" />
                </button>
            )}
        </div>
    );
};
