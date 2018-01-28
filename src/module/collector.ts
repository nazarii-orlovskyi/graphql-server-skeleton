import * as path from 'path';
import * as fs from 'fs';
import ModuleInterface from './interface';
import ModuleDefault from './default';

export interface ModuleCollectorOptions {
    modulesPath: string;
}

export class ModuleCollector {
    protected _options: ModuleCollectorOptions;

    constructor(options: ModuleCollectorOptions) {
        this._options = options;
    }

    async getModules(): Promise<ModuleInterface[]> {
        const modules: ModuleInterface[] = [];

        const getModuleFilePath = (moduleName: string) => {
            return path.resolve(this._options.modulesPath, moduleName, 'module');
        };

        const readDir = (modulesPath: string): Promise<string[]> => {
            return new Promise((resolve, reject) => {
                fs.readdir(modulesPath, (err, files) => {
                    if (err) reject(err);
    
                    resolve(files);
                });
            });
        };
        
        const moduleNames = await readDir(this._options.modulesPath);
        for (const moduleName of moduleNames) {
            try {
                const moduleConstructor = require(getModuleFilePath(moduleName)).default;
                modules.push(new moduleConstructor);
            } catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    modules.push(new ModuleDefault(
                        path.resolve(this._options.modulesPath, moduleName)
                    ));
                } else {
                    throw err;
                }
            }
        }

        return modules;
    }
}
