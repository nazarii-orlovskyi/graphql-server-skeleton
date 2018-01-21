import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as mogran from 'morgan';
import * as rotatingFileStream from 'rotating-file-stream';
import { each } from 'lodash';

import config from '../config';
import { loadSchema } from '../schema';

async function createApp(): Promise<express.Application> {
    const app = express();
    
    // Access log
    const accessLogStream = rotatingFileStream('access.log', {
        interval: '1d',
        path: config.accessLogDirectory,
    });
    app.use(mogran('tiny', { stream: accessLogStream }));
    
    // Schema
    const schemaByVersion = await loadSchema();

    // GraphQL
    each(schemaByVersion, (schema, version) => {
        app.use('/graphql/' + version, bodyParser.json(), graphqlExpress({ schema }));
        app.use('/graphiql/' + version, graphiqlExpress({ endpointURL: '/graphql/' + version }));
        console.log(`Version ${version} initialized`);
    })

    return app;
};

//for integration tests
export default createApp;
