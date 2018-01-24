import Counter from '../../lib/counter';

export const typeDefs = `
    type Query {
        current: Int
    }

    type Mutation {
        increment: Int

        #Сетить значення каунтера до переданого в параметрі value
        setValue(value: Int!): Int @deprecated
    }
`;

export const counter = new Counter();

export const resolver = {
    Query: {
        current() {
            return counter.getValue();
        }
    },

    Mutation: {
        increment() {
            return counter.incValue();
        },
        setValue(_context: any, { value }: { value: number }): number {
            counter.setValue(value);

            return value;
        },
    }
}