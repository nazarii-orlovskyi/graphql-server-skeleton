export default {
    accessLogDirectory: '/tmp/access-log/',

    server: {
        port: process.env.PORT || 8080,
    },

    graphql: {
        apiVerion: 2,
        schema: {
            moduleSchemaGlob: '../modules/**/graphql/v*/schema.js',
        }
    },
};
