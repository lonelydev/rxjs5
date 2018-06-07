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
    let xhr = new XMLHttpRequest();

    xhr.addEventListener(
        "load",
        () => {
            let movies = JSON.parse(xhr.responseText);
            movies.forEach(m => {
                let div = document.createElement("div");
                div.innerText = m.title;
                output.appendChild(div);
            })
        }
    );
    xhr.open("GET", url);
    xhr.send();
}

/**
 * Instead of creating a full blown class with the three methods, 
 * you could just pass an object with the three methods, or at least 
 * one function which serves as the definition of next()
 */
click.subscribe(
    e => load("movies.json"),
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
