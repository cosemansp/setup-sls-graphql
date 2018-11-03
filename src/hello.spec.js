import { promisify } from 'util';
import hello from './hello';

// const promisify = (handler) => (event, context) =>
//   new Promise((resolve, reject) => {
//     handler(event, context, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });

describe('hello', () => {
  it('executes as expected', async () => {
    const asyncHandler = promisify(hello);
    const result = await asyncHandler({ test: 1212 }, {});
    expect(result).toMatchSnapshot();
  });
});
