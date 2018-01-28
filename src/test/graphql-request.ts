import * as request from 'supertest';
import { GraphQlApplication } from '../app';

export const app = GraphQlApplication.createApp();

export async function makeGraphQlRequest(
    apiVersion: number,
    query: string, 
    variables: object | undefined = undefined,
): Promise<any> {
    return new Promise((resolve, reject) => {
        request(app.expressApp)
            .post('/graphql/v' + apiVersion)
            .send({ query, variables })
            .end((err, res) => {
                if (err) reject(err);

                resolve(res.body);
            });
    });
}
