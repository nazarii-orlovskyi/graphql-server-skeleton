import { resolver } from '../../graphql/v1/schema';
import { expect } from 'chai';

describe('Query.hello', () => {
    it('should return world', () => {
        expect(resolver.Query.hello()).to.equal('World!!!');
    });
});
