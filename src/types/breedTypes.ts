// types/breedTypes.ts

export type Breed = {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  temperament?: string;
  origin?: string;
  weight?: { imperial: string; metric: string };
  height?: { imperial: string; metric: string };
  life_span?: string;
  description?: string;
  image?: {
    url: string;
  };
};

export type BreedImage = {
  id: string;
  url: string;
};