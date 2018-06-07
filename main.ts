import { Observable, Observer } from "rxjs";
/**
 * To optimize the size of the bundle that is being sent to the browser
 * always import only what you need like below. However for the purpose of the tutorial
 * we can stick to the earlier method of importing a larger set.
 */
// import { Observable } from "rxjs/Observable";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

let numbers = [1, 5, 10];
let source = Observable.create(observer => {
    let index = 0;
    let produceValue = () => {
        observer.next(numbers[index++]);
        if (index < numbers.length) {
            setTimeout(produceValue, 250);
        } else {
            observer.complete();
        }
    }
    produceValue();
}).map(n => n * 2)
    .filter(n => n > 4);

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
