// eslint-disable-next-line
export const typedefs = `
  type DocType {
    id: ID
    label: String
    isRequired: Boolean
    tags: [String]
  }

  type Category {
    id: ID
    name: String
    isGeneric: Boolean
    label: String
    docTypes: [DocType]
    documents: [Document]
  }

  type Document {
    id: ID
    name: String
    category: Category
    docType: DocType
  }

  type Address {
    street: String
    number: String
    city: String
    zip: String
    country: String
  }

  type Activity {
    id: ID
    type: String
    metaData: String
    createdAt: DateTime
  }

  type Estate {
    id: ID!
    name: String
    owner: Account
    address: Address
    categories(name: String): [Category]
    documents: [Document]
    activities(last: Int): [Activity]
  }

  input AddEstateInput {
    name: String!
    address: AddressInput
  }

  input AddressInput {
    street: String
    number: String
    city: String
    zip: String
    country: String
  }

  type AddEstatePayload {
    estate: Estate
  }
`;
