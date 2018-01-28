import { requestV1 } from '../../../../../test/integration-test-helpers';

describe('Counter', () => {
    it('Query.current return 0 by default', async () => {
        await requestV1.expectRequest(
            '{ current }',
            { current: 0 },
        );

        await requestV1.expectRequest(
            '{ current }',
            { current: 0 },
        );
    });

    it('Mutation.setValue reset counter to passed value', async () => {
        await requestV1.expectRequest(
            `mutation {
                setValue(value: 136)
            }`,
            {
                setValue: 136,
            },
        );

        await requestV1.expectRequest(
            `{
                current
            }`,
            {
                current: 136,
            },
        );
    });

    it('Mutation.increment increment counter by 1', async () => {
        await requestV1.expectRequest(
            `mutation {
                increment
            }`,
            {
                increment: 1,
            },
        );

        await requestV1.expectRequest(
            `mutation {
                increment
            }`,
            {
                increment: 2,
            },
        );

        await requestV1.expectRequest(
            '{ current }',
            { current: 2 },
        );
    });

    it('Mutation.decrement decrement value by one', async () => {
        requestV1.makeRequest('mutation { setValue(value: 2) }');

        await requestV1.expectRequest(
            `mutation {
                decrement
            }`,
            {
                decrement: 1,
            },
        );

        await requestV1.expectRequest(
            `mutation {
                decrement
            }`,
            {
                decrement: 0,
            },
        );

        await requestV1.expectRequest(
            `mutation {
                decrement
            }`,
            {
                decrement: 0,
            },
        );
    });
});
