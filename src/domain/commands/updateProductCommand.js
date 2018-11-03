import { db } from '@/utils/miniMongo';
import { NotFoundError } from '@/errors';

const updateProductCommand = async (resource, productId) => {
  const product = await db.products.$findByIdAndUpdate(productId, {
    sku: resource.sku,
    title: resource.title,
    basePrice: resource.basePrice,
    price: resource.price || resource.basePrice,
    stocked: resource.stocked || false,
    desc: resource.desc,
    image: resource.image,
  });
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  return product;
};

export default updateProductCommand;
