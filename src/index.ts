import config from './config';
import createApp from './app';
import { createServer } from 'http';
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { each } from 'lodash';

createApp().then((createAppResult) => {
    createAppResult.app.listen(config.server.port, () => {
        console.log(`Server listen on http://localhost:${config.server.port}`);
    });

    // create web socket servers (one per api version)
    each(createAppResult.schemaByVersion, (schema, version) => {
        const ws = createServer(createAppResult.app as any);
        ws.listen(config.server.socketPortBase + parseInt(version), () => {
            new SubscriptionServer({
                execute,
                subscribe,
                schema
            }, {
                server: ws,
                path: `/graphql/v${version}/subscriptions`,
            });
        });
    });
});
