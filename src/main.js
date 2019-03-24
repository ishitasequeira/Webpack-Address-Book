 import './../scss/main.scss';  

import { Observable, fromEvent, combineLatest, zip } from 'rxjs'; 
// import { map, debounceTime } from 'rxjs/operators';

var modal = document.getElementById("addContactModal");
let button = document.getElementById('addContact');
let buttonClick$ = fromEvent(button, 'click');
buttonClick$.subscribe(x => modal.style.display="block");


// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display="none";
    }
});