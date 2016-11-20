var CONTACTS = {
    //  list with all contacts from the localstorage
    contactList: {},

    initContactList: function () {
        CONTACTS.contactList.contacts = [];
        //AddItem will add the default information.
        CONTACTS.addItem("Dave Hunter", "123-456-7890", "hunt0278@algonquinlive.com", -1);
        //This storeItems will store in the localstorage.
        CONTACTS.storeItems();
    },
//With fillmodal I am storing 
    fillModal: function (listItem) {
        document.getElementById("name").className = "";
        if (listItem) {
            document.getElementById("name").value = listItem.querySelector("h3").textContent;
            document.getElementById("phone").value = listItem.querySelector(".phone").textContent;
            document.getElementById("email").value = listItem.querySelector(".email").textContent;
            document.querySelector(".modal").setAttribute("data-position", listItem.getAttribute("data-position"));
        } else {
            document.getElementById("name").value = "";
            document.getElementById("phone").value = "";
            document.getElementById("email").value = "";
            document.querySelector(".modal").setAttribute("data-position", -1);
        }
    },

    addItem: function (fullname, phone, email, position) {
        //new contact
        if (position == -1) {
            let contact = {
                "fullname": fullname,
                "phone": phone,
                "email": email
            }
            CONTACTS.contactList.contacts.push(contact);
            //update contact
        } else {
            CONTACTS.contactList.contacts[position].fullname = fullname;
            CONTACTS.contactList.contacts[position].phone = phone;
            CONTACTS.contactList.contacts[position].email = email;
        }

        //sort list by name (fullname) in alphabetical order
        CONTACTS.contactList.contacts.sort(function (a, b) {
            if (a.fullname.toUpperCase().trim() < b.fullname.toUpperCase().trim()) {
                return -1;
            } else if (a.fullname.toUpperCase().trim() > b.fullname.toUpperCase().trim()) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    deleteItem: function (position) {
        CONTACTS.contactList.contacts.splice(position, 1);
    },

    storeItems: function () {
        localStorage.setItem("hunt0278", JSON.stringify(CONTACTS.contactList));
    },

    createContactHTML: function (fullname, phone, email, position) {

        let listItem = document.createElement("li");
        listItem.className = "contact";
        console.log(listItem);
        let btnDelete = document.createElement("spam");
        btnDelete.className = "delete";
        btnDelete.addEventListener("click", CONTACTS.btnDeleteClick);
        listItem.appendChild(btnDelete);
        console.log(btnDelete);
        let h3Name = document.createElement("h3");
        h3Name.textContent = fullname;
        listItem.appendChild(h3Name);
        console.log(h3Name);
        let pEmail = document.createElement("p");
        pEmail.textContent = email;
        pEmail.className = "email";
        listItem.appendChild(pEmail);
        console.log(pEmail);
        let pPhone = document.createElement("p");
        pPhone.textContent = phone;
        pPhone.className = "phone";
        listItem.appendChild(pPhone);
        console.log(pPhone);
        listItem.setAttribute("data-position", position);
        listItem.addEventListener("click", CONTACTS.toogleModal);

        return listItem;
    },

    drawContactList: function () {
        //clears all listeners from memory
        let deleteList = document.querySelectorAll(".delete");
        deleteList.forEach(function (spam) {
            spam.removeEventListener("click", CONTACTS.btnDeleteClick);
            console.log(deleteList);
        });
        let liList = document.querySelectorAll("li");
        liList.forEach(function (li) {
            li.removeEventListener("click", CONTACTS.toogleModal);
             console.log(liList);
        });

        //removes childs
        let main = document.querySelector("main");
        main.removeChild(main.firstChild);

        //redraws elements
        let ul = document.createElement("ul");
        ul.className = "contacts";
        CONTACTS.contactList.contacts.forEach(function (item, position) {
            ul.appendChild(CONTACTS.createContactHTML(item.fullname, item.phone, item.email, position));
        });

        //draws only once on screen
        main.appendChild(ul);
        console.log(ul);
    },

    toogleModal: function () {
        let modal = document.querySelector(".cover")
        let state = modal.getAttribute("data-state");

        if (state == "open") {
            modal.setAttribute("data-state", "closed");
        } else {
            let mode = this.getAttribute("data-mode");
            if (mode == "add") {
                CONTACTS.fillModal();
            } else {
                CONTACTS.fillModal(this);
            }
            modal.setAttribute("data-state", "open");
        }
    },

    /**
     * Event from Save button at modal window
     * Adds / Updates a contact
     */
    btnSaveClick: function () {
        //event.preventDefault();

        let fullname = document.getElementById("name").value;
        if (fullname == "") {
            document.getElementById("name").className = "error";
        } else {
            let phone = document.getElementById("phone").value;
            let email = document.getElementById("email").value;
            let position = document.querySelector(".modal").getAttribute("data-position");
console.log( "Full name " + fullname + "\n" +"Phone " + phone + "\n" + "email " + email + "\n" + "At position " + position);
            CONTACTS.addItem(fullname, phone, email, position);
            CONTACTS.storeItems();
            CONTACTS.drawContactList();
            CONTACTS.toogleModal();
        }
    },

    /**
     * Event from delete button at contact list.
     * Deletes the selected contact
     */
    btnDeleteClick: function (event) {
        event.stopPropagation();
        let position = this.parentElement.getAttribute("data-position");
        CONTACTS.deleteItem(position);
        CONTACTS.storeItems();
        CONTACTS.drawContactList();
    },

    /**
     * Application initialization
     */
    init: function () {
        if (localStorage) {
            let lsData = localStorage.getItem('hunt0278');

            console.log(lsData);

            if (lsData == null) {
                CONTACTS.initContactList();
            } else {
                CONTACTS.contactList = JSON.parse(lsData);
                if (CONTACTS.contactList.contacts.length == 0) {
                    CONTACTS.initContactList();
                }
            }

            CONTACTS.drawContactList();

            //listeners
            document.querySelector(".fab").addEventListener("click", CONTACTS.toogleModal);
            document.querySelector(".close").addEventListener("click", CONTACTS.toogleModal);
            document.getElementById("save").addEventListener("click", CONTACTS.btnSaveClick);
        } else {

            let main = document.querySelector("main");
            main.innerHTML = "<p>Sorry but your browser does not support localStorage</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", CONTACTS.init);