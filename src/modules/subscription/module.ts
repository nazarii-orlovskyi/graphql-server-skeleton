import ModuleAbstract from "../../module/abstract";
import { slowTimer } from './lib/slow-timer';
import { quickTimer } from './lib/quick-timer';

export default class SubscriptionsModule extends ModuleAbstract {
    protected _modulePath = __dirname;

    init() {
        slowTimer.start();
        quickTimer.start();
    }

    destroy() {
        slowTimer.stop();
        quickTimer.stop();
    }
}