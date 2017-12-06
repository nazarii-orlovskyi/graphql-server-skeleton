import app from '../index';
import * as chai from 'chai';

export async function makeGraphQlRequest(
    query: string, 
    variables: object | null = null
): Promise<object> {
    return await chai.request(await app)
        .post('/graphql')
        .send({ query , variables });
};