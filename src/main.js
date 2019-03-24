 import './../scss/main.scss';  

import { Observable, fromEvent,fromPromise} from 'rxjs/Rx'; 

// import { map, debounceTime } from 'rxjs/operators';

var modal = document.getElementById("addContactModal");
let button = document.getElementById('addContact');
let buttonClick$ = Observable.fromEvent(button, 'click');
buttonClick$.subscribe(x => modal.style.display="block");


// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display="none";
    }
});

//retreiving data from server using fetchapi
const fetch$ = Observable
  .from(fetch("http://localhost:3000/contacts"))
  .flatMap(response => response.json());
    fetch$.subscribe(x=>{
        for(var i = 0; i<x.length;i++){
        const row = document.createElement("li");
        row.innerHTML=x[i].FirstName + " " + x[i].LastName;
        document.getElementById("list").append(row);
        console.log(x[i]);
    }
    });
// var result = fromPromise(fetch("http://localhost:3000/contacts"));
// result.subscribe(x=>{
//     // document.createElement("li").innerHTML=x.first
//     alert(x.getBody());
// })