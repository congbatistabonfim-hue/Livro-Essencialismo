
import { ArtifactCard } from "../types";

const UNLOCKED_CARDS_KEY = 'essencialismo_unlocked_cards';

// Define the "Hero's Journey" Artifacts based on Essentialism chapters
export const ARTIFACTS: ArtifactCard[] = [
  {
    id: 'choice',
    title: 'A Espada da Escolha',
    description: 'O poder invencível de escolher. Você recuperou sua agência e não é mais um refém das circunstâncias.',
    archetype: 'Weapon',
    chapterTriggerId: 36, // End of Ch 2
    rarity: 'Legendary',
    iconPath: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' 
  },
  {
    id: 'discernment',
    title: 'A Lente da Verdade',
    description: 'A capacidade de distinguir o ruído trivial das poucas coisas vitais. Sua visão agora é clara.',
    archetype: 'Tool',
    chapterTriggerId: 43, // End of Ch 3
    rarity: 'Epic',
    iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
  },
  {
    id: 'tradeoff',
    title: 'A Balança do Destino',
    description: 'A sabedoria para aceitar que não se pode ter tudo. Você aprendeu a arte sagrada da troca.',
    archetype: 'Relic',
    chapterTriggerId: 49, // End of Ch 4
    rarity: 'Rare',
    iconPath: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
  },
  {
    id: 'escape',
    title: 'O Manto do Silêncio',
    description: 'A habilidade de criar espaço para pensar e escapar do ruído. Um santuário portátil.',
    archetype: 'Amulet',
    chapterTriggerId: 58, // End of Ch 5
    rarity: 'Rare',
    iconPath: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
  },
  {
    id: 'play',
    title: 'A Chama da Criança',
    description: 'A redescoberta do brincar como combustível para a inovação e exploração.',
    archetype: 'Relic',
    chapterTriggerId: 71, // End of Ch 7
    rarity: 'Epic',
    iconPath: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z'
  },
  {
    id: 'sleep',
    title: 'O Elixir da Vitalidade',
    description: 'A proteção do seu ativo mais valioso: você mesmo. O sono agora é sua arma secreta.',
    archetype: 'Amulet',
    chapterTriggerId: 80, // End of Ch 8
    rarity: 'Common',
    iconPath: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
  },
  {
    id: 'select',
    title: 'O Crivo de Ouro',
    description: 'O critério extremo. Se não é um "SIM" óbvio, então é um não óbvio.',
    archetype: 'Tool',
    chapterTriggerId: 88, // End of Ch 9
    rarity: 'Legendary',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    id: 'courage',
    title: 'O Escudo da Coragem',
    description: 'A bravura para dizer um não elegante e proteger seu tempo.',
    archetype: 'Weapon',
    chapterTriggerId: 112, // End of Ch 11
    rarity: 'Legendary',
    iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
  }
];

export const getUnlockedArtifacts = (): string[] => {
  const stored = localStorage.getItem(UNLOCKED_CARDS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const checkAndUnlockArtifact = (pageId: number): ArtifactCard | null => {
  // Find if this page triggers an artifact
  const artifact = ARTIFACTS.find(a => a.chapterTriggerId === pageId);
  
  if (artifact) {
    const unlockedIds = getUnlockedArtifacts();
    if (!unlockedIds.includes(artifact.id)) {
      // Unlock it!
      const newUnlocked = [...unlockedIds, artifact.id];
      localStorage.setItem(UNLOCKED_CARDS_KEY, JSON.stringify(newUnlocked));
      return artifact;
    }
  }
  return null;
};
