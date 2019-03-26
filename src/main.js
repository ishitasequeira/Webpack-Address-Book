import './../scss/main.scss';
import { Observable } from 'rxjs/Rx';
import { addContact } from 'Root/addContact';
import { printData, clearValue } from 'Root/dataOperations'


var modal = document.getElementById("addContactModal");
var modal1 = document.getElementById("viewContactModal");
let button = document.getElementById('addContact');
let buttonClick$ = Observable.fromEvent(button, 'click');//add event listener
buttonClick$.subscribe({
    next: x => {
        modal.style.display = "block";
    }, complete: () => { console.log("Completing new contact button click subscription") }
});

var submit = document.getElementById("submit");
let submitClick$ = Observable.fromEvent(submit, "click");
submitClick$.subscribe({ next: x => {addContact(localJSON);}, complete: () => { console.log("Completing submit button click subscription") } });

// When the user clicks anywhere outside of the modal, close it
let windowClick$ = Observable.fromEvent(window, 'click');
windowClick$.subscribe({ next: x => {hideModal(x);}, complete: () => { console.log("Completing window click subscription") } });

function hideModal(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearValue();
    }
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
};


//fetch api observable for GET method
const fetch$ = Observable
    .from(fetch("http://localhost:3000/contacts"))
    .flatMap(response => response.json());

readData();

var localJSON;
//retreiving data from server using fetchapi
function readData() {
    fetch$.subscribe({
        next: x => {
            localJSON = x;
            printData(localJSON);
        },
        complete: () => { console.log("Completing read data subscription") }
    });
}

var ul = document.querySelector("#list");
var list$ = Observable.fromEvent(ul, "click");
list$.subscribe({
    next: x => {
        // console.log(x.target.id);
        if (x.target.id != null && x.target.id != "list" && x.target != 'div') {
            // Get user with id
            const getContactById$ = Observable.from(fetch("http://localhost:3000/contacts/" + x.target.id))
                .flatMap(response => response.json());

            getContactById$.subscribe({
                next: x => {
                    modal1.style.display = "block";
                    document.getElementById("first").innerHTML = (x.FirstName == undefined) ? "" : x.FirstName;
                    document.getElementById("last").innerHTML = (x.LastName == undefined) ? "" : x.LastName;
                    document.getElementById("phoneNo").innerHTML = (x.PhoneNumber == undefined) ? "" : x.PhoneNumber;
                    document.getElementById("addr").innerHTML = (x.EmailId == undefined) ? "" : x.EmailId;
                }, complete: () => { console.log("Completing get contact by id subscription"); }
            });
        }
    }, complete: () => { console.log("Completing contact select click subscription"); }
});

window.onunload = function (){
    getContactById$.unsubscribe();
    list$.unsubscribe();
    fetch$.unsubscribe();
    add$.unsubscribe();
    buttonClick$.unsubscribe();
    submitClick$.unsubscribe();
    windowClick$.unsubscribe();
    alert("Bye Bye!!!! Had fun working with you!! Hope you had fun too!!");
}