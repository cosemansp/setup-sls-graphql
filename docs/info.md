# Tips and info

## To Improve

- Look if we can use https://automattic.github.io/monk/

## Tips for Lambda-api

Docs
- https://www.npmjs.com/package/lambda-log


There is an optional third parameter that takes an error handler callback. If the underlying getSignedUrl() call fails, the error will be returned using the standard res.error() method. You can override this by providing your own callback.

```
// async/await
api.get('/getLink', async (req,res) => {
  let url = await res.getLink('s3://my-bucket/my-file.pdf')
  return { link: url }
})
```

Want even more convenience? The redirect() method now accepts S3 file references and will automatically generate a signed URL and then redirect the user’s browser.

```
// This will redirect a signed URL using the getLink method
api.get('/redirectToS3File', (req,res) => {
  res.redirect('s3://my-bucket/someFile.pdf')
})
```

More Cache Control

```
// 'cache-control': 'no-cache, no-store, must-revalidate'
res.cache(false).send()

// 'cache-control': 'max-age=1'
res.cache(1000).send()

// 'cache-control': 'private, max-age=30'
res.cache(30000,true).send()
```

## Environment variables

Docs
- https://serverless.com/blog/serverless-secrets-api-keys/

Plugin
- https://www.npmjs.com/package/serverless-dotenv-plugin

Articles
- https://www.jeremydaly.com/how-to-manage-serverless-environment-variables-per-stage/

Create tokens

```bash
aws ssm put-parameter --name supermanToken --type String --value mySupermanToken
```

## Running the scripts

```bash
# babel-node
npx babel-node ./scripts/seedData.mjs

# nodemon
nodemon --exec babel-node ./scripts/seedData.mjs
```

## MongoDB in a serverless world

Docs
- https://docs.mongodb.com/stitch/mongodb/actions/collection.find/
- https://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find

Articles
- https://blog.cloudboost.io/i-wish-i-knew-how-to-use-mongodb-connection-in-aws-lambda-f91cd2694ae5
- [Building a Serverless REST API with Node.js and MongoDB](https://hackernoon.com/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47)
- [best-practices-connecting-to-aws-lambda](https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/)

- [building-a-serverless-rest-api-with-nodejs](https://github.com/adnanrahic/building-a-serverless-rest-api-with-nodejs)

- [building-a-serverless-rest-api-with-nodejs-and-mongodb-stitch](https://github.com/adnanrahic/building-a-serverless-rest-api-with-nodejs-and-mongodb-stitch)
