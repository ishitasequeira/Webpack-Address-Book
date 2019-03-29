import './../scss/main.scss';
import { Observable } from 'rxjs/Rx';
import { addContact } from 'Root/addContact';
import { printData, clearValue } from 'Root/dataOperations'

/**
 * @var modal stores an element addContactModal
 */
var modal = document.getElementById("addContactModal");

/**
 * @var modal1 stores an element viewContactModal
 */
var modal1 = document.getElementById("viewContactModal");

/**
 * @var button stores an element addContact button
 */
let button = document.getElementById('addContact');

/**
 * @desc add event listener to the button
 * @returns an Observable
 */
let buttonClick$ = Observable.fromEvent(button, 'click');

/**
 * @desc subscribe to buttonClick event
 * @param - next and complete actions
 */
buttonClick$.subscribe({
    next: x => {
        modal.style.display = "block";
    }, complete: () => { console.log("Completing new contact button click subscription") }
});

/**
 * @var submit stores an element addContact button
 */
var submit = document.getElementById("submit");

/**
 * @desc add event listener to the button
 * @returns an Observable
 */
let submitClick$ = Observable.fromEvent(submit, "click");

/**
 * @desc subscribe to buttonClick event
 * @param - next and complete actions
 */
submitClick$.subscribe({ next: x => {addContact(localJSON);}, complete: () => { console.log("Completing submit button click subscription") } });

/** 
 * @desc  When the user clicks anywhere outside of the modal, close it
 * @returns returns an Observable
 */
let windowClick$ = Observable.fromEvent(window, 'click');

/** @desc subscribe to window click observable */
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


/** @desc fetch api observable for GET method  */
const fetch$ = Observable
    .from(fetch("http://localhost:3000/contacts")).flatMap(response => response.json());

readData();

var localJSON;
/** @desc retreiving data from server using fetchapi */
function readData() {
    fetch$.subscribe({
        next: x => {
            localJSON = x;
            printData(localJSON);
        },
        error:()=>{console.log("Connection has not been  created")},
        complete: () => { console.log("Completing read data subscription") }
    });
}

/** @desc get the ul on the document */
var ul = document.querySelector("#list");

/**
 * @desc click event anywhere on the ul
 * @param ul - element from the document
 * @param - event name
 * @returns returns an Observable
 */
var list$ = Observable.fromEvent(ul, "click");

/**
 * @desc subscription for click event on ul
 * @param - next and complete actions
 */
list$.subscribe({
    next: x => {
        /** @desc select what is the target of the click inside ul */
        if (x.target.id != null && x.target.id != "list" && x.target != 'div') {

            /**
             * @desc fetch details of specific user id
             * @returns an Observable containing fetch api call of type GET
             */
            const getContactById$ = Observable.from(fetch("http://localhost:3000/contacts/" + x.target.id))
                .flatMap(response => response.json());

            /**
             * @desc subscription to  the fetch api observable
             * @param - next and complete actions
             */
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

/**
 * @desc window unload function to remove subscriptions of all observables
 */
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