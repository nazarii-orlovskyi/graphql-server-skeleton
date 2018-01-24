import { makeGraphQlRequest } from '../../../../../test/graphql-request';
import { expect } from 'chai';

describe('Query.hello', () => {
    it('should return world', async () => {
        const response = await makeGraphQlRequest(2, '{ hello }')
        expect(response.data).to.deep.equal({ hello: 'Hello, World!!!'});
    })
});