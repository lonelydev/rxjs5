import { Observable, Observer } from "rxjs";
import { retryWhen } from "rxjs/operator/retryWhen";

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
        let onLoad = () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        }
        xhr.addEventListener("load", onLoad);
        xhr.open("GET", url);
        xhr.send();
        /** return a function here that gets invoked to cancel an operation
         * ability to clean up
         * 
         */
        return () => {
            console.log("cleanup");
            xhr.removeEventListener("load", onLoad);
            xhr.abort();
        }
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
        return Observable.fromPromise(
            fetch(url)
                .then(r => {
                    if (r.status === 200) {
                        r.json();
                    } else {
                        return Promise.reject(r);
                    }
                })
        ); // wrong place to put retry when as it is retyring the rejected promis
        // there won't be any network request made! .retryWhen(retryStrategy());
    }).retryWhen(retryStrategy());
}

function retryStrategy({ attempts = 4, delay = 1000 } = {}) {
    return function (errors) {
        return errors
            /**
             * scan operator => 
             * aggregator to count elements coming through sequence
             * sum a property of elements coming through sequence
             */
            .scan((acc, value) => {
                // let us propagate the error to the subscriber instead
                // /** acc is the number
                //  *  value is the statusText
                //  */
                // console.log(acc, value);
                // // return new value for the accumulator
                // return acc + 1;
                acc += 1;
                if (acc < attempts) {
                    return acc;
                } else {
                    throw new Error(value);
                }
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
