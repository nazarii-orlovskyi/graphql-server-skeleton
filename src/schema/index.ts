import * as path from 'path';
import * as glob from 'glob';
import config from '../config';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-schema-tools';

interface SchemaDefinitionInterface {
    typeDefs: string;
    resolver: object;
}

function collectModulesSchemaFiles(files: string[]): string[] {
    const map: { [key: string]: string} = {};

    for (const file of files) {
        const matches = file.match(/.*\/(\w+)\/graphql\/v[0-9]+\/schema\.(t|j)s$/)
        if (matches) {
            const [, moduleName] = matches;
            map[moduleName] = file;
        } else {
            throw new Error('File not matched to schema pattern: ' + file);
        }
    }

    const result = [];
    for(const file of Object.values(map)) {
        result.push(file);
    }

    return result;
}

export function loadSchema(): Promise<{ [key: string]: GraphQLSchema }> {
    return new Promise((resolve, reject) => {
        const schemaByVersions: { [key: string]: GraphQLSchema } = {};
        const lastVersion = config.graphql.enabledApiVerions[config.graphql.enabledApiVerions.length - 1];
        config.graphql.enabledApiVerions.forEach((version) => {
            const filesGlob = path
                .resolve(__dirname, config.graphql.schema.moduleSchemaGlob)
                .replace(':version', version.toString());

            glob(filesGlob, function (err, files) {       
                if (err) {
                    reject(err);
                }

                files = collectModulesSchemaFiles(files);

                const modules: SchemaDefinitionInterface[] = [];
                for (const file of files) {
                    modules.push(require(file));
                }

                const typeDefs = modules.map((m) => m.typeDefs);
                const resolvers: any[] = modules.map((m) => m.resolver).filter((res) => !!res);

                schemaByVersions['v' + version] = makeExecutableSchema({ typeDefs, resolvers });

                if (version === lastVersion) {
                    resolve(schemaByVersions);
                }
            }); 
        });
    })
};
