import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as mogran from 'morgan';
import * as rotatingFileStream from 'rotating-file-stream';

import config from './config';
import { loadSchema } from './schema';

async function createApp() {
    const app = express();
    
    // Access log
    const accessLogStream = rotatingFileStream('access.log', {
        interval: '1d',
        path: config.accessLogDirectory,
    });
    app.use(mogran('tiny', { stream: accessLogStream }));
    
    const schema = await loadSchema();

    // GraphQL
    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

    app.listen(config.server.port, () => {
        console.log(`Server listen on http://localhost:${config.server.port}`);
    });

    return app;
};

//for integration tests
export default createApp();
