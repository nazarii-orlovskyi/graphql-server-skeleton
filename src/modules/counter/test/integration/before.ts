import { counter } from '../../graphql/v1/schema';

export function before() {
    counter.setValue(0);
}