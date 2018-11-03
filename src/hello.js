import middy from 'middy';
import {
  warmup,
  jsonBodyParser,
  cors,
  httpErrorHandler,
} from 'middy/middlewares';
import { json } from './utils/rest';

// handler
const hello = async (event, context) => {
  const message = 'Go Serverless! Your function executed successfully!';
  console.log(event, context);
  return json({ message });
};

const isWarmingUp = (event) => event.isWarmingUp === true;
const onWarmup = (event) => console.log('I am just warming up', event);

export default middy(hello)
  .use(warmup({ isWarmingUp, onWarmup }))
  .use(jsonBodyParser())
  .use(cors({ origin: '*', credentials: true }))
  .use(httpErrorHandler());
