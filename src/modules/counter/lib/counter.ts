export default class Counter {
    protected _counter = 0;

    getValue() {
        return this._counter;
    }

    incValue() {
        return ++this._counter;
    }

    setValue(value: number) {
        this._counter = value;

        return this._counter
    }

    decValue(): number {
        if (this._counter) {
            this._counter--;
        }

        return this._counter
    }
};
