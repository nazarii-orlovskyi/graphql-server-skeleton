import { PubSub } from 'graphql-subscriptions';
import { slowTimer } from '../../lib/slow-timer';

export const typeDefs = `
    type Subscription {
        time: String
    }
`;

const pubsub = new PubSub();
slowTimer.listener = () => {
    pubsub.publish('time', { time: new Date().toISOString() });
};

export const resolver = {
    Subscription: {
        time: {
            subscribe() {
                return pubsub.asyncIterator('time');
            },
        },
    },
};
