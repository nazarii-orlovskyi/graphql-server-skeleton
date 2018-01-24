import * as express from 'express';
import * as path from 'path';
import ModuleInterface from './interface';
import ModuleSchemaInterface from './schema-interface';

export default abstract class ModuleAbstract implements ModuleInterface {
    protected _modulePath: string;

    get modulePath(): string {
        if (!this._modulePath) {
            throw new Error('Module path not defined');
        }

        return this._modulePath;
    }

    init(_app: express.Application) {}
    destroy(_app: express.Application) {}

    getShema(apiVersion: number): Promise<ModuleSchemaInterface | null> {
        return new Promise((resolve, reject) => {
            try {
                resolve(require(path.resolve(this.modulePath, `graphql/v${apiVersion}/schema`)));
            } catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    resolve(null);
                } else {
                    reject(err);
                }
            }
        });
    }
}