export interface SampleAvatar {
  id: string;
  name: string;
  gender: 'female' | 'male';
  url: string;
}

export const SAMPLE_AVATARS: SampleAvatar[] = [
  {
    id: 'sample-1',
    name: 'Emma',
    gender: 'female',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-2',
    name: 'Marcus',
    gender: 'male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-3',
    name: 'Sophia',
    gender: 'female',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sample-4',
    name: 'David',
    gender: 'male',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
];
