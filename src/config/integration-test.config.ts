import baseConfig from './base.config';

export default {
    graphql: {
        schema: {
            moduleSchemaGlob: '../modules/**/graphql/v*/schema.ts'
        }
    },

    server: {
        port: 8092
    }
} as typeof baseConfig;