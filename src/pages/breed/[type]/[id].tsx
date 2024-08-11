import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import { fetchDogBreeds, fetchCatBreeds, fetchBreedImages } from '../../../lib/api';
import { Breed, BreedImage } from '../../../types/breedTypes';

type BreedPageProps = {
  breed: Breed | null;
  images: BreedImage[];
};

type Params = {
  type: string;
  id: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
    try {
      const [dogBreeds, catBreeds] = await Promise.all([
        fetchDogBreeds(),
        fetchCatBreeds(),
      ]);
  
      const paths = [
        ...dogBreeds.map((breed: Breed) => ({
          params: { type: breed.type || 'dog', id: breed.id.toString() },
        })),
        ...catBreeds.map((breed: Breed) => ({
          params: { type: breed.type || 'cat', id: breed.id.toString() },
        })),
      ];
  
      return {
        paths,
        fallback: 'blocking',
      };
    } catch (error) {
      console.error('Failed to generate static paths:', error);
      return {
        paths: [],
        fallback: 'blocking',
      };
    }
  };

export const getStaticProps: GetStaticProps<BreedPageProps, Params> = async (context) => {
  const { type, id } = context.params || {};

  if (!type || !id) {
    return {
      notFound: true,
    };
  }

  try {
    const breeds: Breed[] = type === 'dog' ? await fetchDogBreeds() : await fetchCatBreeds();
    const breed = breeds.find((b: Breed) => b.id.toString() === id) || null;
    const images = await fetchBreedImages(type, id);

    console.log('Breed data:', JSON.stringify(breed, null, 2));

    return {
      props: {
        breed,
        images,
      },
      revalidate: 3600, 
    };
  } catch (error) {
    console.error('Failed to fetch breed or images:', error);
    return {
      props: {
        breed: null,
        images: [],
      },
    };
  }
};

const BreedPage = ({ breed, images }: BreedPageProps) => {
  if (!breed) return <div className="container mx-auto p-4">Breed not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{breed.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {breed.image && (
            <Image
              src={breed.image.url}
              alt={breed.name}
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          )}
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Details</h2>
            <p><strong>Temperament:</strong> {breed.temperament}</p>
            <p><strong>Origin:</strong> {breed.origin}</p>
            <p><strong>Weight:</strong> {breed.weight?.metric} kg</p>
            {breed.height && <p><strong>Height:</strong> {breed.height.metric} cm</p>}
            <p><strong>Life Span:</strong> {breed.life_span}</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p>{breed.description}</p>
          <h2 className="text-xl font-semibold mt-8 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <Image
                key={image.id}
                src={image.url}
                alt={`${breed.name} gallery image`}
                width={250}
                height={250}
                className="rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreedPage;