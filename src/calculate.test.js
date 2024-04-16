import {factorial, product} from './calculate';
import {test, describe, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope

describe('factorial', () => {

    test('5! is 120', () => {
        expect(factorial(5)).toBe(120)
    });

    test('0! is 1', () => {
        expect(factorial(0)).toBe(1)
    });

    test('Factorial of negative int is throwing exception ', () => {
        expect(() => {
            factorial(-5);
        }).toThrow();
    });

})

describe('product', () => {
    test('product of 1 to 5 using default term should be 120', () => {
        const term = jest.fn(k => k);
        expect(product(5, term)).toBe(120);

        expect(term).toHaveBeenCalledTimes(5);
        expect(term).toHaveBeenNthCalledWith(1, 1);
        expect(term).toHaveBeenNthCalledWith(2, 2);
        expect(term).toHaveBeenNthCalledWith(3, 3);
        expect(term).toHaveBeenNthCalledWith(4, 4);
        expect(term).toHaveBeenNthCalledWith(5, 5);
    });

    test('product of 1 to 5 using custom term function should be 3840', () => {
        const term = jest.fn(k => k * 2);

        expect(product(5, term)).toBe(3840);
        expect(term).toHaveBeenCalledTimes(5);
        expect(term).toHaveBeenNthCalledWith(1, 1);
        expect(term).toHaveBeenNthCalledWith(2, 2);
        expect(term).toHaveBeenNthCalledWith(3, 3);
        expect(term).toHaveBeenNthCalledWith(4, 4);
        expect(term).toHaveBeenNthCalledWith(5, 5);
    });

    test('a function should throw if the number is negative', () => {
        expect(() => {
            product(-5);
        }).toThrow();
    });

    test('a function should throw if n is not a number', () => {
        expect(() => {
            product('5');
        }).toThrow();
    })
});