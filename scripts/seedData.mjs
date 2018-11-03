/* eslint-disable no-underscore-dangle */

import faker from 'faker';
import shortid from 'shortid';
import { db, MongoUri } from '../src/utils/miniMongo';

function generateFakeProduct() {
  return {
    _id: shortid.generate(),
    category: faker.commerce.product(),
    title: faker.hacker.noun(),
    description: faker.lorem.paragraph(),
    sku: faker.phone.phoneNumber(),
    imageUrl: faker.image.imageUrl(),
    price: faker.commerce.price(),
    creationAt: faker.date.past(),
    updatedAt: new Date(),
  };
}

function createFakeCategory(id) {
  const name = faker.commerce.product();
  const cat = {
    id,
    name,
    isGeneric: faker.random.boolean(),
    label: `${faker.commerce.productAdjective()} ${name}`,
    docTypes: [],
  };
  cat.docTypes.push(
    { id: 1, label: 'contract', isRequired: true, tags: ['contract', 'singed'] },
    { id: 2, label: 'plan', isRequired: false, tags: ['architect', 'architecture'] },
  );
  return cat;
}

function createFakeDocument(id, categoryId, docTypeId) {
  return { id, name: faker.system.fileName(), categoryId, docTypeId };
}

function createFakeEstate(accountId) {
  const estate = {
    _id: shortid.generate(),
    accountId,
    name: faker.company.companyName(),
    address: {
      city: faker.address.city(),
      zip: faker.address.zipCode(),
      number: faker.random.number(),
      street: faker.address.streetName(),
      latitude: faker.address.latitude(),
      longitude: faker.address.latitude(),
    },
    categories: [],
    documents: [],
  };
  estate.categories.push(createFakeCategory(1));
  estate.categories.push(createFakeCategory(2));
  estate.categories.push(createFakeCategory(3));
  estate.categories.push(createFakeCategory(4));

  estate.documents.push(createFakeDocument(1, 1, 1));
  estate.documents.push(createFakeDocument(2, 1, 1));
  estate.documents.push(createFakeDocument(3, 2, 1));
  estate.documents.push(createFakeDocument(4, 2, 1));
  estate.documents.push(createFakeDocument(5, 2, 2));
  return estate;
}

async function seedProducts() {
  const products = [];
  for (let i = 0; i < 20000; i += 1) {
    products.push(generateFakeProduct());
  }
  console.log(products);
  const result = await db.products.insertMany(products);
  // const products = await db.products.find().toArray();
  console.log(result);
}

function createFakeActivities(accountId, estateId) {
  const random = Math.floor(Math.random() * 30) + 1;
  const activities = [];
  for (let i = 0; i < random; i += 1) {
    activities.push({
      _id: shortid.generate(),
      type: faker.hacker.verb(),
      accountId,
      estateId,
      createdAt: new Date(),
      metaData: faker.lorem.sentence(),
    });
  }
  return activities;
}

async function seedEstates() {
  const account = {
    _id: '9999',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
  };

  const numberOfAccounts = await db.accounts.countDocuments();
  if (numberOfAccounts) {
    return;
  }

  await db.accounts.insertOne(account);
  const estates = [];
  const estate1 = createFakeEstate(account._id);
  const estate2 = createFakeEstate(account._id);
  estates.push(estate1);
  estates.push(estate2);
  await db.estates.insertMany(estates);

  const activities1 = createFakeActivities(account._id, estate1._id);
  await db.activities.insertMany(activities1);

  const activities2 = createFakeActivities(account._id, estate2._id);
  await db.activities.insertMany(activities2);
}

// open DB and launch seed
// const prod = generateFakeProduct();
// console.log(prod);
const mongoUri = MongoUri.parse(process.env.MONGODB_URI);
db.connect(mongoUri).then(() => {
  db.bind('products');
  db.bind('accounts');
  db.bind('estates');
  db.bind('activities');

  seedEstates()
    .then(() => {
      console.log('success');
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      db.close().then(() => {
        console.log('DB closed');
      });
    });
});
