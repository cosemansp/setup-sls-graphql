import createApp from 'lambda-api';
import * as yup from 'yup';
import logger from 'lambda-logger-node';

import deleteProductCommand from '@/domain/commands/deleteProductCommand';
import updateProductCommand from '@/domain/commands/updateProductCommand';
import createProductCommand from '@/domain/commands/createProductCommand';
import { NotFoundError, BadRequestError } from '@/errors';
import { withWarmup } from '@/utils/middleware';

import { MongoUri, db } from '@/utils/miniMongo';

import productMapper from '../mappers/productMapper';
import errorHandler from '../middleware/errorHandler';
import validator from '../validator';

logger.setMinimumLogLevel('INFO');

const api = createApp({
  // logger: {
  //   level: 'debug',
  //   access: true,
  // },
  logger: false,
});

const productSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required(),
  price: yup.number().required(),
  basePrice: yup.number(),
  stocked: yup.boolean(),
});

api.get('api/products', async () => {
  console.log('get all products');

  const products = await db.products
    .find()
    .limit(30)
    .toArray();
  return products.map((product) => productMapper.map(product));
});

api.get('api/products/:id', async (req, res) => {
  console.info('get product', req.params.id);
  const product = await db.products.$findById(req.params.id);
  if (!product) {
    throw new NotFoundError();
  }
  res.status(200).send(productMapper.map(product));
});

api.post('api/products', async (req) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    throw new BadRequestError(result.errors);
  }

  const product = await createProductCommand(req.body);
  return productMapper.map(product);
});

api.put('api/products/:id', async (req) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    throw new BadRequestError(result.errors);
  }

  const product = await updateProductCommand(req.body, req.params.id);
  return productMapper.map(product);
});

api.delete('api/products/:id', async (req, res) => {
  const product = await deleteProductCommand(req.params.id);
  if (!product) {
    res.status(204).json();
    return undefined;
  }
  return productMapper.map(product);
});

// handle cors
api.options('/*', (req, res) => {
  res.cors({
    origin: 'example.com',
    methods: 'GET, POST, DELETE, PUT',
    //    headers: 'content-type, authorization',
    maxAge: 84000000,
  });
});

api.use(async (req, res, next) => {
  console.log('MONGODB_URI', process.env.MONGODB_URI);
  const mongoUri = MongoUri.parse(process.env.MONGODB_URI);
  req.db = await db.connect(mongoUri);
  db.bind('products');
  next();
});

// handle errors
api.use(errorHandler);

// lambda function
const productsHandler = (event, context) => {
  // Allows a Lambda function to return its result to the caller without requiring
  // that the MongoDB database connection be closed.
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line

  logger.restoreConsoleLog();
  return api.run(event, context);
};

// export
// export default logger(withWarmup(productsHandler));
export default withWarmup(productsHandler);
