import { Observable, Observer } from "rxjs";
/**
 * To optimize the size of the bundle that is being sent to the browser
 * always import only what you need like below. However for the purpose of the tutorial
 * we can stick to the earlier method of importing a larger set.
 */
// import { Observable } from "rxjs/Observable";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

let circle = document.getElementById("circle");
let source = Observable.fromEvent(document, "mousemove")
    .map((e: MouseEvent) => {
        return {
            x: e.clientX,
            y: e.clientY
        }
    })
    .filter(n => n.x < 500)
    .delay(300);


function onNext(value) {
    circle.style.left = value.x;
    circle.style.top = value.y;
}
/**
 * Instead of creating a full blown class with the three methods, 
 * you could just pass an object with the three methods, or at least 
 * one function which serves as the definition of next()
 */
source.subscribe(
    onNext,
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
