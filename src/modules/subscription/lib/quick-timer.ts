import { SlowTimer } from './slow-timer';

export class QuickTimer extends SlowTimer {
    protected _tickInterval = 100;
}

export const quickTimer = new QuickTimer();
