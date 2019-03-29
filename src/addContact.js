import { Observable } from 'rxjs/Rx';
import { printData, clearValue } from 'Root/dataOperations';

/**
 * Thre below fumction checks if the name(fname and lname is present) or phoneNumber is already present 
 * @desc to addContact  function
 * @param localJSON   - localJSON file
 * @return function -The error handler function.
 */
exports.addContact = function (localJSON) {
    var modal = document.getElementById("addContactModal");
    var fname = document.getElementById("first_name").value;
    var lname = document.getElementById("last_name").value;
    var phnum = document.getElementById("phonenumber").value;
    var email = document.getElementById("emailID").value;
    /** @desc to avoid  wrong inputs from going forward */
    if (fname != null && lname != null && phnum != null && fname != undefined
        && lname != undefined && phnum != undefined && fname != "" && lname != "" && phnum != "") {

        var present = false;
        var msg = "";
        var valid = true;
        /** 
         * @desc check the phonenumber and email if it follows the pattern or not
        * */
        var phoneno = /^\(?([1-9]{1}[0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phnum.match(phoneno)) {
            valid = false;
            msg = "Please enter a 10 digit valid phone number!"
        }
        if (email == null || email == undefined || email == "") {
            email = "";
        } else {
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(mailformat)) {
                valid = false;
                msg = "Please enter a valid email-id!"
            }
        }

        /** 
         * @desc if the number is 10 digit and name is not null then it will further check 
         *       in database  if the same phone number or name is present or not
        * */
        if (valid) {
            for (var k = 0; k < localJSON.length; k++) {
                if (localJSON[k].FirstName == fname && localJSON[k].LastName == lname) {
                    present = true;
                    msg = "Name already present!";
                    break;
                }
                if (localJSON[k].PhoneNumber == phnum) {
                    present = true;
                    msg = "Phone Number already saved under another contact!";
                    break;
                }

            }
        }
        /** 
         * @desc if the contct is not present and it is valid then it will be added to mongo
        * */
        if (!present && valid) {

            /**
             * @desc observable to fetch api for POST method
             */
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
                        /** 
                        * @desc converting the data into rsesponse.json
                        * */
                    })).flatMap(response => response.json());


            /** 
             * @desc to  subscribed to add observable
             * */
            add$.subscribe({
                next: x => {
                    /** 
                    * @desc added the new contact in local json
                    * */
                    localJSON.push(x);
                    var li;
                    /** 
                    * @desc cleared the list present
                    * */
                    var lis = document.querySelectorAll('#list li');
                    for (var i = 0; li = lis[i]; i++) {
                        li.parentNode.removeChild(li);
                    }
                    /** 
                    * @desc called the function to  print the data on the main page
                    * */

                    printData(localJSON);

                }, error: () => { console.log("Connection has not been  created") }
                , complete: () => { console.log("Completing post contact subscription") }
            });
            modal.style.display = "none";
            clearValue();

        } else {
            /** 
            * @desc added logic to show error if the mandatory fields are not filled
            * */
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

        /** 
         * @desc added logic to show error if the mandatory fields are not filled
        * */
        var modalBody = document.getElementById('modal-body');
        var h3 = modalBody.querySelector("h3");
        if (h3 != null)
            modalBody.removeChild(h3);
        var l1 = document.createElement("h3");
        l1.innerHTML = "Please fill in the the First name, Last name and valid Phone number";
        l1.style.color = "red";
        modalBody.append(l1);
    }

}

