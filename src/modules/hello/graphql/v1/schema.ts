export const typeDefs = `
    type Query {
        hello: String
    }
`;

export const resolver = {
    Query: {
        hello() {
            return 'World!!!';
        },
    },
};
