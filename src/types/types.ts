export type Image = {
    url: string;
  };
  
  export type Breed = {
    id: string;  
    name: string;
    type: 'dog' | 'cat';  
    image?: Image;
  };
  