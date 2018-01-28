import 'source-map-support/register';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as mogran from 'morgan';
import * as rotatingFileStream from 'rotating-file-stream';
import { each } from 'lodash';
import { createServer } from 'http';
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { ModuleCollector } from '../module/collector';

import config from '../config';
import { loadSchema, SchemaByVersionsInterface } from '../schema';
import ModuleInterface from '../module/interface';

export class GraphQlApplication {
    protected _schemaByVersion: SchemaByVersionsInterface | undefined;
    protected _app: express.Application;
    protected _config: typeof config;
    protected _modules: ModuleInterface[];

    get schema(): SchemaByVersionsInterface {
        if (!this._schemaByVersion) {
            throw new Error('Shema no defined');
        }

        return this._schemaByVersion;
    }

    get expressApp(): express.Application {
        if (!this._app) {
            throw new Error('Express application are not initialized');
        }

        return this._app;
    }

    static createApp(): GraphQlApplication {
        return new GraphQlApplication();
    }

    constructor() {
        this._config = config;
    }

    protected async _loadModules() {
        const collector = new ModuleCollector({
            modulesPath: this._config.modulesPath
        });
        this._modules = await collector.getModules();
    }

    public async init(): Promise<void> {
        await this._loadModules();

        this._app = express();

        if (this._config.accessLog.enabled) {
            const accessLogStream = rotatingFileStream('access.log', {
                interval: '1d',
                path: this._config.accessLog.directory,
            });
            this._app.use(mogran('tiny', { stream: accessLogStream }));
        }

        for (const module of this._modules) {
            await module.init(this._app);
        }

        this._schemaByVersion = await loadSchema(this._modules);

        each(this._schemaByVersion, (schema, version) => {
            const apiRoute = `/graphql/v${version}`;
    
            this._app.use(apiRoute, bodyParser.json(), graphqlExpress({ schema }));

            if (this._config.graphiql.enabled) {
                this._app.use(`/graphiql/v${version}`, graphiqlExpress({ 
                    endpointURL: apiRoute,
                    subscriptionsEndpoint: `ws://localhost:${config.server.socketPortBase + parseInt(version)}${apiRoute}/subscriptions`,
                }));
            }

            console.log(`Version ${version} initialized`);
        })
    }

    public async destroy() {
        for (const module of this._modules) {
            await module.destroy(this._app);
        }
    }

    public async listen(): Promise<void> {
        this._app.listen(this._config.server.port, () => {
            console.log(`Server listen on http://localhost:${this._config.server.port}`);
        });
    
        // create web socket servers (one per api version)
        each(this._schemaByVersion, (schema, version) => {
            const ws = createServer(this._app as any);
            ws.listen(this._config.server.socketPortBase + parseInt(version), () => {
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
    } 
}
