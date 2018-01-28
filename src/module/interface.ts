import * as express from 'express';
import ModuleSchemaInterface from './schema-interface';

export default interface ModuleInterface {
    getShema(apiVersion: number): Promise<ModuleSchemaInterface | null>;
    init(app: express.Application): void | Promise<void>;
    destroy(app: express.Application): void | Promise<void>;
}
