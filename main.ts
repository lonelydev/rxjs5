import { Observable, Observer } from "rxjs";

let numbers = [1, 5, 10];
let source = Observable.from(numbers);

/**
 * Instead of creating a full blown class with the three methods, 
 * you could just pass an object with the three methods, or at least 
 * one function which serves as the definition of next()
 */
source.subscribe(
    value => console.log(`value: ${value}`),
    e => console.log(`error: ${e}`),
    () => console.log("complete")
);

/**
 * Formal definition of an observer
 * it needs three methods
 */
// class MyObserver implements Observer<number> {
//     /**
//      * this is the method that the observable will invoke when 
//      * there is a value to produce
//      */
//     next(value) {
//         console.log(`value is: ${value}`);
//     }

//     error(e) {
//         console.log(`error: ${e}`);
//     }

//     complete() {
//         console.log("complete");
//     }
// }

// source.subscribe(new MyObserver());
