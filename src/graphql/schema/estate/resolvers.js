import { db } from '@/utils/miniMongo';

// eslint-disable-next-line
export const resolvers = {
  Estate: {
    id: (estate) => estate._id,
    owner: (estate) => {
      return db.accounts.$findById(estate.accountId);
    },
    documents: (estate) => {
      // inject categories info the document so we can access it in the Document
      // resolver
      return estate.documents.map((doc) => {
        return { ...doc, categories: estate.categories };
      });
    },
    categories: (estate, { name }) => {
      // filter categories on name
      const filteredCategories = estate.categories.filter((cat) => !name || cat.name === name);
      // inject documents info the category so we can access it in the Category
      // resolver
      return filteredCategories.map((cat) => {
        return {
          ...cat,
          documents: estate.documents,
        };
      });
    },
    activities: (estate, { last }) => {
      return db.activities
        .find({ estateId: estate._id, accountId: estate.accountId })
        .sort('createdAt', -1)
        .limit(last)
        .toArray();
    },
  },
  Category: {
    documents: ({ id, documents }) => {
      return documents.filter((doc) => doc.categoryId === id);
    },
  },
  Document: {
    category: ({ categoryId, categories }) => {
      return categories.find((category) => category.id === categoryId);
    },
    docType: ({ docTypeId, categoryId, categories }) => {
      const docCategory = categories.find((category) => category.id === categoryId);
      return docCategory.docTypes.find((docType) => docType.id === docTypeId);
    },
  },
};
