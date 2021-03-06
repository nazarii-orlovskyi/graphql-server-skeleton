import { makeGraphQlRequest } from './graphql-request';
import { expect } from 'chai';

export class GraphQlRequestHelper {
    protected _apiVersion: number;

    constructor(apiVersion: number) {
        this._apiVersion = apiVersion;
    }

    async makeRequest(query: string, variables?: object | undefined) {
        return await makeGraphQlRequest(this._apiVersion, query, variables);
    }

    async expectRequest(query: string, expected: object): Promise<void> {
        await this.expectRequestWithVars(query, {}, expected);
    }

    async expectRequestWithVars(query: string, variables: object, expected: object): Promise<void> {
        const response = await this.makeRequest(query, variables);

        if (response.errors) {
            throw new Error('GraphQL error received: ' + response.errors[0].message);
        }

        expect(response.data).to.deep.eq(expected);
    }
}

export default function getIntegrationTestHelper(apiVersion: number): GraphQlRequestHelper {
    return new GraphQlRequestHelper(apiVersion);
}

export const requestV1 = getIntegrationTestHelper(1);
export const requestV2 = getIntegrationTestHelper(2);
export const requestV3 = getIntegrationTestHelper(3);
export const requestV4 = getIntegrationTestHelper(4);
export const requestV5 = getIntegrationTestHelper(5);
