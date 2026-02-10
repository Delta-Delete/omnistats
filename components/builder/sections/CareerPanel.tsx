
import React from 'react';
import { PlayerSelection, Entity } from '../../../types';
import { InstitutePanel, ReligionPanel, CommercePanel, AdventurePanel, AthletePanel, ArtistPanel } from '../CareerMechanics';

interface CareerPanelProps {
    selection: PlayerSelection;
    setSelection: React.Dispatch<React.SetStateAction<PlayerSelection>>;
    entities: Entity[];
}

export const CareerPanel: React.FC<CareerPanelProps> = ({ selection, setSelection, entities }) => {
    // Return null if no career selected
    if (!selection.careerId) return null;

    const currentCareer = entities.find(e => e.id === selection.careerId);
    if (!currentCareer) return null;

    switch (selection.careerId) {
        case 'career_institut':
            return <InstitutePanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        case 'career_religion':
            return <ReligionPanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        case 'career_commerce':
            return <CommercePanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        case 'career_adventure':
            return <AdventurePanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        case 'career_athlete':
            return <AthletePanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        case 'career_artiste':
            return <ArtistPanel selection={selection} setSelection={setSelection} career={currentCareer} />;
        default:
            return null;
    }
};
