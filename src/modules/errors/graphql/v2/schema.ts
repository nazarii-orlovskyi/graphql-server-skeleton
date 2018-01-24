export const typeDefs = `
    type Query {
        native: String
    }
`;

export const resolver = {
    Query: {
        native() {
            throw new Error('This is native error');
        },
    }
};
