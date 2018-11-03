import { db } from '@/utils/miniMongo';

const deleteProductCommand = (productId) => {
  const product = db.products.$findByIdAndDelete(productId);
  if (!product) {
    return null;
  }
  return product;
};

export default deleteProductCommand;
