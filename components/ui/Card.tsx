
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-lg relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-slate-800 bg-slate-950/30 flex items-center justify-between ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; icon?: React.ElementType; className?: string }> = ({ children, icon: Icon, className = '' }) => (
  <h3 className={`text-lg font-perrigord text-white flex items-center tracking-wide ${className}`}>
    {Icon && <Icon size={20} className="mr-2 opacity-80" />}
    {children}
  </h3>
);

// --- NEW COLLAPSIBLE CARD ---

interface CollapsibleCardProps {
    id: string; // Unique ID for localStorage
    title: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    headerActions?: React.ReactNode; // Content to display on the right (buttons, counters)
    defaultCollapsed?: boolean;
    className?: string;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
    id, title, icon: Icon, children, headerActions, defaultCollapsed = false, className = '' 
}) => {
    // Initialize state from localStorage if available, otherwise default
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem(`card_state_${id}`);
        return saved !== null ? JSON.parse(saved) : !defaultCollapsed;
    });

    // State pour gérer l'overflow : on ne veut "visible" que si la carte est stable et ouverte
    const [isOverflowVisible, setIsOverflowVisible] = useState(isOpen);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Gestion intelligente de l'overflow pour permettre aux dropdowns de sortir du cadre
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (isOpen) {
            // À l'ouverture : on attend la fin de la transition (300ms) pour permettre le débordement
            timer = setTimeout(() => setIsOverflowVisible(true), 300);
        } else {
            // À la fermeture : on coupe immédiatement le débordement pour que l'anim fonctionne
            setIsOverflowVisible(false);
        }
        return () => clearTimeout(timer);
    }, [isOpen]);

    const toggle = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        localStorage.setItem(`card_state_${id}`, JSON.stringify(newState));
    };

    // If not mounted yet (SSR hydration matching), render static to avoid layout shift, or default
    if (!isMounted) return (
        <Card className={className}>
            <CardHeader>
                <CardTitle icon={Icon}>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );

    return (
        <div className={`bg-slate-900 border transition-all duration-300 rounded-xl shadow-lg relative ${isOpen ? 'border-slate-800' : 'border-slate-800/50'} ${className}`}>
            {/* CLICKABLE HEADER */}
            <div 
                onClick={toggle}
                className={`p-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isOpen ? 'bg-slate-950/30 border-b border-slate-800' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
                <div className="flex items-center">
                    <h3 className={`text-lg font-perrigord flex items-center tracking-wide transition-colors ${isOpen ? 'text-white' : 'text-slate-400'}`}>
                        {Icon && <Icon size={20} className={`mr-2 transition-opacity ${isOpen ? 'opacity-80' : 'opacity-50'}`} />}
                        {title}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    {/* Header Actions (Visible always, but prevent click propagation if interactable) */}
                    {headerActions && (
                        <div onClick={(e) => e.stopPropagation()} className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-60'}`}>
                            {headerActions}
                        </div>
                    )}
                    
                    {/* Chevron Toggle */}
                    <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-800 text-slate-300' : 'text-slate-600 -rotate-90'}`}>
                        <ChevronDown size={18} />
                    </div>
                </div>
            </div>

            {/* CONTENT WITH TRANSITION */}
            <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'} ${isOverflowVisible && isOpen ? 'overflow-visible' : 'overflow-hidden'}`}
            >
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};
