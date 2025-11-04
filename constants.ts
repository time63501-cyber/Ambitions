import type { Ambition } from './types';

export const INITIAL_AMBITIONS: Ambition[] = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    age: 12,
    ambition: 'Astrophysicist',
    imageUrl: 'https://picsum.photos/id/1011/800/600',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
  },
  {
    id: 2,
    name: 'Marcus Chen',
    age: 8,
    ambition: 'Marine Biologist',
    imageUrl: 'https://picsum.photos/id/1027/800/600',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
  },
  {
    id: 3,
    name: 'Aisha Jamil',
    age: 15,
    ambition: 'Documentary Filmmaker',
    imageUrl: 'https://picsum.photos/id/10/800/600',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    id: 4,
    name: 'Leo Santos',
    age: 10,
    ambition: 'Robotics Engineer',
    imageUrl: 'https://picsum.photos/id/1/800/600',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
  }
];
