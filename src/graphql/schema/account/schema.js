// eslint-disable-next-line
export const typedefs = `
  input UpdateAccountInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
  }

  type UpdateAccountPayload {
    account: Account
  }

  type Account {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    estates: [Estate]
  }
`;
