import { PubSub } from 'graphql-subscriptions';
import { quickTimer } from '../../lib/quick-timer';

export const typeDefs = `
    type Subscription {
        time: String
    }
`;

const pubsub = new PubSub();
quickTimer.listener = () =>  {
    pubsub.publish('time2', { time: new Date().toISOString() });
};

export const resolver = {
    Subscription: {
        time: {
            subscribe() {
                return pubsub.asyncIterator('time2');
            },
        },
    },
};
