import ModuleAbstract from "./abstract";

export default class ModuleDefault extends ModuleAbstract {
    constructor(modulePath: string) {
        super();
        
        this._modulePath = modulePath;
    }
}