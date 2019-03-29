/**
 * @exports clearValue function
 * @desc to clear  the value of the new contact modal.(First name,last name, phone number and email id)
 */
exports.clearValue = function () {
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("phonenumber").value = "";
    document.getElementById("emailID").value = "";
    var modalBody = document.getElementById('modal-body');
    var h3 = modalBody.querySelector("h3");
    if (h3 != null)
        modalBody.removeChild(h3);
}


/**
 * @exports printData function
 * @desc function to print data on the page
 * @param x - localJSON object
 */
exports.printData = function (x) {
    x.sort((a, b) => {
        return a.FirstName.charAt(0).toUpperCase() <= b.FirstName.charAt(0).toUpperCase() ? -1 : 1;
    })
    var pos = 0, currentchar = "A";
    for (var i = 0; i < x.length; i++) {
        const row = document.createElement("li");
        /**
        * @desc The below if loop is to set the id of li
        */
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