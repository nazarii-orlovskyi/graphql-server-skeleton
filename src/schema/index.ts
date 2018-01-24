import config from '../config';
import { GraphQLSchema } from 'graphql';
import { merge } from 'lodash';
import { mergeStrings } from 'gql-merge';
import { makeExecutableSchema } from 'graphql-tools';
import ModuleInterface from '../module/interface';

export interface SchemaByVersionsInterface {
    [version: string]: GraphQLSchema
}

export async function loadSchema(modules: ModuleInterface[]): Promise<SchemaByVersionsInterface> {
    const schemaByVersions: SchemaByVersionsInterface = {};
    for (const apiVersion of config.graphql.enabledApiVerions) {
        const typeDefsArray: string[] = [];
        const resolversArray: object[] = [];

        for (const module of modules) {
            const moduleSchema = await module.getShema(apiVersion);
            if (moduleSchema) {
                typeDefsArray.push(moduleSchema.typeDefs);
                resolversArray.push(moduleSchema.resolver);
            }
        }

        schemaByVersions[apiVersion] = makeExecutableSchema({
            typeDefs: mergeStrings(typeDefsArray),
            resolvers: merge({}, ...resolversArray),
        });
    }

    return schemaByVersions;
};
