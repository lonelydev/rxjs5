import { Observable, Observer } from "rxjs";
/**
 * To optimize the size of the bundle that is being sent to the browser
 * always import only what you need like below. However for the purpose of the tutorial
 * we can stick to the earlier method of importing a larger set.
 */
// import { Observable } from "rxjs/Observable";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";

let output = document.getElementById("output");
let button = document.getElementById("button");
let click = Observable.fromEvent(button, "click");


/**
 * Bad design to start with. 
 * The load method does too many things. 
 * The movies.each shouldn't be inside the load method. 
 * that should be in the application code that the user wants to process
 * according to their liking.
 * @param url 
 */
function load(url: string) {

    return Observable.create(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener(
            "load",
            () => {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    observer.next(data);
                    observer.complete();
                } else {
                    observer.error(xhr.statusText);
                }
            }
        );
        xhr.open("GET", url);
        xhr.send();
        /** so easy to retry!! */
    }).retryWhen(retryStrategy({ attempts: 3, delay: 1500 }));
}

/**
 * https://fetch.spec.whatwg.org/
 * don't worry polyfill and browser support etc. 
 * fetch api doesn't work straight out of the box in typescript
 * so get rid of typings es6-shim.
 * 
 * @param url 
 */
function loadWithFetch(url: string) {
    return Observable.defer(() => {
        return Observable.fromPromise(fetch(url).then(r => r.json()));
    });
}

function retryStrategy({ attempts = 4, delay = 1000 }) {
    return function (errors) {
        return errors
            /**
             * scan operator => 
             * aggregator to count elements coming through sequence
             * sum a property of elements coming through sequence
             */
            .scan((acc, value) => {
                /** acc is the number
                 *  value is the statusText
                 */
                console.log(acc, value);
                // return new value for the accumulator
                return acc + 1;
            },
                /*
                * second param is the start value of the accumulator
                */
                0)
            /**
             * operator to stop the observable when we reach a max retry
             * attempts
             */
            .takeWhile(acc => acc < attempts)
            .delay(delay);
    }
}

function renderMovies(movies) {
    movies.forEach(m => {
        let div = document.createElement("div");
        div.innerText = m.title;
        output.appendChild(div);
    })
}

// the following line will do nothing until subscribed. 
//load("movies.json").subscribe(renderMovies);

loadWithFetch("movies.json");

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
