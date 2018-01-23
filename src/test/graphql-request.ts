import { Application } from 'express';
import * as request from 'supertest';
import createApp from '../app';

let app: Application | null = null;

export async function initApplication(): Promise<void> {
    app = (await createApp()).app;
}

export async function makeGraphQlRequest(
    apiVersion: number,
    query: string, 
    variables: object | null = null
): Promise<any> {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/graphql/v' + apiVersion)
            .send({ query, variables })
            .end((err, res) => {
                if (err) reject(err);

                resolve(res.body);
            });
    });
};