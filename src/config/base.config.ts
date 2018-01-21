export default {
    accessLogDirectory: '/tmp/access-log/',

    server: {
        port: process.env.PORT || 8080,
    },

    graphql: {
        enabledApiVerions: [
            1, 2
        ],
        schema: {
            moduleSchemaGlob: '../modules/**/graphql/v:version/schema.js',
        }
    },
};
