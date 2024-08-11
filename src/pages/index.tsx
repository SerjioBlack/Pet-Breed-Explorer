import { useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { fetchDogBreeds, fetchCatBreeds } from '../lib/api';
import { Breed } from '../types/breedTypes';

type Props = {
  dogBreeds: Breed[];
  catBreeds: Breed[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const [dogBreeds, catBreeds] = await Promise.all([
      fetchDogBreeds(),
      fetchCatBreeds(),
    ]);

    return {
      props: {
        dogBreeds: dogBreeds || [], 
        catBreeds: catBreeds || [], 
      },
      revalidate: 10, 
    };
  } catch (error) {
    console.error('Failed to fetch breeds:', error);
    return {
      props: {
        dogBreeds: [], 
        catBreeds: [], 
      },
    };
  }
};

const HomePage = ({ dogBreeds, catBreeds }: Props) => {
  const [search, setSearch] = useState('');

  const allBreeds = [...dogBreeds, ...catBreeds];

  const filteredBreeds = allBreeds.filter((breed) =>
    breed.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pet Breed Explorer</h1>
      <input
        type="text"
        placeholder="Search breeds..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="grid grid-cols-2 gap-4">
        {filteredBreeds.map((breed) => (
          <Link
          href={breed.type ? `/breed/${breed.type}/${breed.id}` : '#'}
  key={breed.id}
  passHref
          >
            <div className="border rounded-lg p-4 shadow-md cursor-pointer">
              {breed.image?.url ? (
                <img
                  src={breed.image.url}
                  alt={breed.name}
                  className="h-48 w-full object-contain rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
              <h2 className="text-xl text-center font-semibold mt-2">
                {breed.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;