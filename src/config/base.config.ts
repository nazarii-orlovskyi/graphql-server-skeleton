import * as path from 'path';

export default {
    accessLog: {
        directory: path.resolve(__dirname, '../../var/log/'),
        enabled: true,
    },

    server: {
        port: process.env.PORT || 8080,
        socketPortBase: 3000,
    },

    graphql: {
        enabledApiVerions: [
            1, 2
        ],
        schema: {
            moduleSchemaGlob: '../modules/**/graphql/v:version/schema.js',
        }
    },

    graphiql: {
        enabled: false,
    }
};
