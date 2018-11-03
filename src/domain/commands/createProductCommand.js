import { db } from '@/utils/miniMongo';

const createProductCommand = (resource) => {
  const newProduct = {
    ...resource,
    image: resource.image || 'https://dummyimage.com/300x300.jpg',
  };

  // Add to users's
  return db.products.$insertOne(newProduct);
};

export default createProductCommand;
