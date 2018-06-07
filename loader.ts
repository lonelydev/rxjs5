import { Observable, Observer } from "rxjs";

/**
 * Bad design to start with. 
 * The load method does too many things. 
 * The movies.each shouldn't be inside the load method. 
 * that should be in the application code that the user wants to process
 * according to their liking.
 * @param url 
 */
export function load(url: string) {
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
export function loadWithFetch(url: string) {
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
