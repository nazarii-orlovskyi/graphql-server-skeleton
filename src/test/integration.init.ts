import * as glob from 'glob';
import * as path from 'path';
import { initApplication } from './graphql-request';

const beforeEachHandlers: Function[] = [];

before(() => {
    return Promise.all([
        initApplication(),
        initBeforeHandlers()
    ]);
});

beforeEach(() => {
    beforeEachHandlers.forEach(handler => handler());
});

function initBeforeHandlers(): Promise<undefined> {
    return new Promise((resolve, reject) => {
        glob(path.resolve(__dirname, '../modules/**/test/integration/before.js'), (err, files) => {
            if (err) reject(err);
            files.forEach(file => {
                const handler = require(file).before;
                if (typeof handler === 'function') {
                    beforeEachHandlers.push(handler);
                }
            });
            resolve();
        });
    });
}
