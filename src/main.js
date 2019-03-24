import './../scss/main.scss';

import { Observable, fromEvent, fromPromise } from 'rxjs/Rx';

// import { map, debounceTime } from 'rxjs/operators';

var modal = document.getElementById("addContactModal");
var modal1 = document.getElementById("viewContactModal");
let button = document.getElementById('addContact');
let buttonClick$ = Observable.fromEvent(button, 'click');
buttonClick$.subscribe(x => modal.style.display = "block");


// When the user clicks anywhere outside of the modal, close it
let windowClick$ = Observable.fromEvent(window, 'click');
windowClick$.subscribe(x => hideModal(x));

function hideModal(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearValue();
    }
    if (event.target == modal1) {
        modal1.style.display = "none";
    }
};

// submit button logic

var submit = document.getElementById("submit");
let submitClick$ = Observable.fromEvent(submit, "click");
submitClick$.subscribe(x => addContact(x));

// addContact  function
function addContact(event) {
    var fname = document.getElementById("first_name").value;
    var lname = document.getElementById("last_name").value;
    var phnum = document.getElementById("phonenumber").value;
    var email = document.getElementById("emailID").value;
    console.log(fname + lname);
    clearValue();
    const add$ = Observable
        .from(fetch("http://localhost:3000/contacts",
            {
                headers: { "Content-Type": "application/json; charset=utf-8" },
                method: 'POST',
                body: JSON.stringify({
                    FirstName: fname,
                    LastName: lname,
                    PhoneNumber: phnum,
                    EmailId: email
                })


            })).flatMap(response => response.json()); // converting the data into rsesponse.json
// subscribed to add observable
    add$.subscribe(x => {
        //added the new contact in local json
        localJSON.push(x);
        var li;
        //cleared the list present
    var lis = document.querySelectorAll('#list li');
    for(var i=0; li=lis[i]; i++) {
        li.parentNode.removeChild(li);
    }
    //called the function to  print the data on the main page
    printData(localJSON);
    });
    modal.style.display = "none";
}

function clearValue() {
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("phonenumber").value = "";
    document.getElementById("emailID").value = "";
}

//fetch api observable for GET method
const fetch$ = Observable
    .from(fetch("http://localhost:3000/contacts"))
    .flatMap(response => response.json());

readData();

function printData(x) {
    x.sort((a,b)=>{
       return a.FirstName<=b.FirstName?-1:1;
    })
    for (var i = 0; i < x.length; i++) {

        const row = document.createElement("li");
        row.innerHTML = x[i].FirstName + " " + x[i].LastName;
        document.getElementById("list").append(row);
        
    }
}

var localJSON;
//retreiving data from server using fetchapi
function readData() {
    fetch$.subscribe(x => {
        localJSON = x;
        printData(localJSON);
    });
}




