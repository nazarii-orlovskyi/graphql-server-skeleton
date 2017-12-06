import * as path from 'path';
import * as glob from 'glob';
import config from '../config';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-schema-tools';

interface SchemaDefinitionInterface {
    typeDefs: string;
    resolver: object;
}

function collectModulesSchemaFiles(files: string[], apiVersion: number): string[] {
    const map: { [key: string]: { file: string, version: number } } = {};

    for (const file of files) {
        const matches = file.match(/.*\/(\w+)\/graphql\/v([0-9]+)\/schema\.(t|j)s$/)
        if (matches) {
            const [, moduleName, version] = matches;
            const currentVersion = parseInt(version);

            if (typeof map[moduleName] === 'undefined'
                || (apiVersion >= currentVersion 
                    && map[moduleName].version < currentVersion
                )
            ) {
                map[moduleName] = { file, version: currentVersion }
            }
        } else {
            throw new Error('File not matched to schema pattern: ' + file);
        }
    }

    const result = [];
    for(const { file } of Object.values(map)) {
        result.push(file);
    }

    return result;
}

export function loadSchema(): Promise<GraphQLSchema> {
    return new Promise((resolve, reject) => {
        const filesGlob = path.resolve(__dirname, config.graphql.schema.moduleSchemaGlob)
        glob(filesGlob, function (err, files) {       
            if (err) {
                reject(err);
            }

            files = collectModulesSchemaFiles(files, config.graphql.apiVerion);

            const modules: SchemaDefinitionInterface[] = [];
            for (const file of files) {
                modules.push(require(file));
            }

            const typeDefs = modules.map((m) => m.typeDefs);
            const resolvers: any = modules.map((m) => m.resolver).filter((res) => !!res);

            resolve(makeExecutableSchema({ typeDefs, resolvers }))
        });
    })
};
