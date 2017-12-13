import { Application } from 'express';
import * as request from 'supertest';
import createApp from '../index';

let app: Application | null = null;

export async function initApplication(): Promise<void> {
    app = await createApp;
}

export async function makeGraphQlRequest(
    query: string, 
    variables: object | null = null
): Promise<any> {
    return new Promise((resolve, reject) => {
        request(app)
            .post('/graphql')
            .send({ query, variables })
            .end((err, res) => {
                if (err) reject(err);

                resolve(res.body);
            });
    });
};