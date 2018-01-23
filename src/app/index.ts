import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as mogran from 'morgan';
import * as rotatingFileStream from 'rotating-file-stream';
import { each } from 'lodash';

import config from '../config';
import { loadSchema, SchemaByVersionsInterface } from '../schema';

interface CreateAppResult {
    app: express.Application,
    schemaByVersion: SchemaByVersionsInterface
}

async function createApp(): Promise<CreateAppResult> {
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
        const apiRoute = `/graphql/v${version}`;

        app.use(apiRoute, bodyParser.json(), graphqlExpress({ schema }));
        app.use(`/graphiql/v${version}`, graphiqlExpress({ 
            endpointURL: apiRoute,
            subscriptionsEndpoint: `ws://localhost:${config.server.socketPortBase + parseInt(version)}${apiRoute}/subscriptions`,
        }));
        console.log(`Version ${version} initialized`);
    })

    return {
        app,
        schemaByVersion: schemaByVersion
    };
};

export default createApp;
