import { expect } from 'chai';

import Counter from '../../../lib/counter';

describe('lib/counter', () => {
    let counter: Counter;
 
    beforeEach(() => {
        counter = new Counter();
    });

    it('#getValue return zero by default', () => {
        expect(counter.getValue()).to.eq(0);
    });

    it('#incValue add 1 to counter and return current value', () => {
        expect(counter.incValue()).to.eq(1);
        expect(counter.getValue()).to.eq(1);
    });

    it('#setValue set counter value to passed one', () => {
        expect(counter.setValue(15)).to.eq(15);
        expect(counter.getValue()).to.eq(15);
    });

    it('#decValue deecrement value by one', () => {
        counter.setValue(5);
        expect(counter.decValue()).to.eq(4);
    });

    it('#decValue no action when counter is zero', () => {
        counter.setValue(2);
        expect(counter.decValue()).to.eq(1);
        expect(counter.decValue()).to.eq(0);
        expect(counter.decValue()).to.eq(0);
    });
});
