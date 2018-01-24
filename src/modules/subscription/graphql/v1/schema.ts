import { PubSub } from 'graphql-subscriptions';

export const typeDefs = `
    type Subscription {
        time: String
    }
`;

const pubsub = new PubSub();
setInterval(() =>  {
    pubsub.publish('time', { time: new Date().toISOString() });
}, 1000);

export const resolver = {
    Subscription: {
        time: {
            subscribe() {
                return pubsub.asyncIterator('time')
            }
        }
    }
}