export class SlowTimer {
    public listener: Function | null;
    protected _timerId: NodeJS.Timer;
    protected _tickInterval = 2000;

    start() {
        this._timerId = setInterval(() => {
            if (this.listener) {
                this.listener.apply({});
            }
        }, 1000);
    }

    stop() {
        clearInterval(this._timerId);
    }
}

export const slowTimer = new SlowTimer();