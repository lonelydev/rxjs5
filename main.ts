import { Observable, Observer } from "rxjs";
import { load, loadWithFetch } from "./loader";
/**
 * To optimize the size of the bundle that is being sent to the browser
 * always import only what you need like below. However for the purpose of the tutorial
 * we can stick to the earlier method of importing a larger set.
 */
// import { Observable } from "rxjs/Observable";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

// let source = Observable.create(observer => {
//     observer.next(1);
//     observer.next(2);
//     //unhandled error!!
//     //throw new Error("stop!");
//     //observer error - handle-able
//     observer.error("stop!");
//     observer.next(3);
//     observer.complete();
// });


// let source = Observable.merge(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// ).catch(e => {
//     console.log(`caught: ${e}`);
//     return Observable.of(10);
// });

// let source = Observable.onErrorResumeNext(
//     Observable.of(1),
//     Observable.from([2, 3, 4]),
//     Observable.throw(new Error("Stop!")),
//     Observable.of(5)
// );



// source.subscribe(
//     value => console.log(`value: ${value}`),
//     error => console.log(`error is: ${error}`),
//     () => console.log("complete")
// );

let output = document.getElementById("output");
let button = document.getElementById("button");
let click = Observable.fromEvent(button, "click");

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    })
}

// the following line will do nothing until subscribed. 
//load("movies.json").subscribe(renderMovies);

let subscription = load("movies.json")
    .subscribe(renderMovies,
        e => console.log(`error: ${e}`),
        () => console.log("complete!"));

console.log(subscription);
// subscription.unsubscribe();

/**
 * How do I process the movies that are fetched from the URL.  
 */

/** the following code means, applying map operator to the click observable 
 * and then subscribing to the click observable.
 * However we need to subscribe to the inner observable - load()
 * so to grab hold of that we use flatMap() operator instead of the map().
 * flatMap flattens the outer observable to the inner observable.
 */
click.flatMap(e => loadWithFetch("movies.json"))
    .subscribe(renderMovies,
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
