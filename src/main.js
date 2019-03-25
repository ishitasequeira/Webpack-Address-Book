import './../scss/main.scss';
import { Observable, fromEvent, fromPromise } from 'rxjs/Rx';
import { reduce } from 'rxjs/operators';

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
    if (fname != null && phnum != null && fname != undefined && phnum != undefined && fname != "" && phnum != "") {

        var present = false;
        var msg = "";
        for (var k = 0; k < localJSON.length; k++) {
            if (localJSON[k].FirstName == fname) {
                present = true;
                msg = "First Name already present!";
                break;
            }
            if (localJSON[k].PhoneNumber == phnum) {
                present = true;
                msg = "Phone Number already saved under another contact!";
                break;
            }
        }

        if (!present) {
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
                for (var i = 0; li = lis[i]; i++) {
                    li.parentNode.removeChild(li);
                }
                //called the function to  print the data on the main page
                printData(localJSON);
            });
            modal.style.display = "none";
            clearValue();

        } else {
            var modalBody = document.getElementById('modal-body');
            var h3 = modalBody.querySelector("h3");
            if (h3 != null)
                modalBody.removeChild(h3);
            var l1 = document.createElement("h3");
            l1.innerHTML = msg;
            l1.style.color = "red";
            modalBody.append(l1);
        }
    } else {
        var modalBody = document.getElementById('modal-body');
        var h3 = modalBody.querySelector("h3");
        if (h3 != null)
            modalBody.removeChild(h3);
        var l1 = document.createElement("h3");
        l1.innerHTML = "Please fill in the the First name and Phone number";
        l1.style.color = "red";
        modalBody.append(l1);
    }

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
    x.sort((a, b) => {
        return a.FirstName <= b.FirstName ? -1 : 1;
    })

    
    var pos = 0;
    var currentchar = "A";

    for (var i = 0; i < x.length; i++) {
        const row = document.createElement("li");
        // to set the id of li
        if (currentchar == x[i].FirstName.charAt(0).toUpperCase()) {
            pos++;
        } else {
            currentchar = x[i].FirstName.charAt(0).toUpperCase();
            pos = 1;
        }

        row.id = currentchar + pos;

        const rowLabel = document.createElement("div");

        rowLabel.innerHTML = x[i].FirstName + " " + x[i].LastName;
        rowLabel.id = x[i]._id;
        row.append(rowLabel);
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

var ul = document.querySelector("#list");
var list$ = Observable.fromEvent(ul, "click");
list$.subscribe(x => {
    console.log(x.target.id);
    if (x.target.id != null || x.target.id != "list") {
        // Get user with id
        const getContactById$ = Observable.from(fetch("http://localhost:3000/contacts/" + x.target.id))
            .flatMap(response => response.json());

        getContactById$.subscribe(x => {
            modal1.style.display = "block";
            document.getElementById("first").innerHTML = (x.FirstName == undefined) ? "" : x.FirstName;
            document.getElementById("last").innerHTML = (x.LastName == undefined) ? "" : x.LastName;
            document.getElementById("phoneNo").innerHTML = (x.PhoneNumber == undefined) ? "" : x.PhoneNumber;
            document.getElementById("addr").innerHTML = (x.EmailId == undefined) ? "" : x.EmailId;
        })

    }
});



