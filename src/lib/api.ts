import axios from 'axios';
import { Breed, BreedImage  } from '../types/breedTypes'; 

const DOG_API_KEY = process.env.DOG_API_KEY;
const CAT_API_KEY = process.env.CAT_API_KEY;

export async function fetchDogBreeds(): Promise<Breed[]> {
  const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
    headers: {
      'x-api-key': DOG_API_KEY,
    },
  });
  return response.data.map((breed: any) => ({
    ...breed,
    type: 'dog',
    id: breed.id.toString(), 
  }));
}

export async function fetchCatBreeds(): Promise<Breed[]> {
  const response = await axios.get('https://api.thecatapi.com/v1/breeds', {
    headers: {
      'x-api-key': CAT_API_KEY,
    },
  });
  return response.data.map((breed: any) => ({
    ...breed,
    type: 'cat',
    id: breed.id.toString(), 
  }));
}

export async function fetchBreedImages(type: string, breedId: string): Promise<BreedImage[]> {
  const apiKey = type === 'dog' ? DOG_API_KEY : CAT_API_KEY;
  const apiUrl = type === 'dog' 
    ? `https://api.thedogapi.com/v1/images/search?breed_id=${breedId}&limit=10`
    : `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=10`;

  const response = await axios.get(apiUrl, {
    headers: {
      'x-api-key': apiKey,
    },
  });
  return response.data;
}
