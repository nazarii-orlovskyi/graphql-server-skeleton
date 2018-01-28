import * as path from 'path';

export default {
    accessLog: {
        directory: path.resolve(__dirname, '../../var/log/'),
        enabled: true,
    },

    modulesPath: path.resolve(__dirname, '../modules'),

    server: {
        port: process.env.PORT || 8080,
        socketPortBase: 3000,
    },

    graphql: {
        enabledApiVerions: [
            1, 2,
        ],
    },

    graphiql: {
        enabled: false,
    },
};
