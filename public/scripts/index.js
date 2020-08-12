const listView = document.querySelector('#lstItems');

const modalTitle = document.querySelector('#modalLongTitle');
const modalDescription = document.querySelector('#modalDescription');
const modalCategory = document.querySelector('#modalCategory');
const modalPrice = document.querySelector('#modalPrice');
const modalSeller = document.querySelector('#modalSeller');
const modalLocation = document.querySelector('#modalLocation');
const modalContact = document.querySelector('#modalContact');

const addForm = document.querySelector('#addForm');
const deleteForm = document.querySelector('#deleteForm');

async function getAllEntries()
{
    clearList(listView);

    try
    {
        const response = await fetch('/items');
        const entries = await response.json();
        entries.forEach(entry => {
            const tmpItem = document.createElement("button");
            tmpItem.innerHTML = '<button type=button class="list-group-item list-group-item-action"><p><span style="float:left;">'+entry.title+'</span><span style="float:right;">$'+entry.price+'</span></p></button>';
            tmpItem.addEventListener('click',()=>{loadModal(entry._id)});
            tmpItem.classList.add("list-group-item");
            tmpItem.setAttribute("data-toggle", "modal");
            tmpItem.setAttribute("data-target", "#modalCenter");
            listView.appendChild(tmpItem);
        });
    }
    catch(e)
    {
        const tmpItem = document.createElement("button");
        tmpItem.innerHTML = "Error loading data. Please try again.";
        tmpItem.classList.add("list-group-item");
        listView.appendChild(tmpItem);
    }
}

async function loadModal(id)
{
    const response = await fetch('items/' + id);
    const entry = await response.json();
    modalTitle.innerHTML = entry.title;
    modalDescription.innerHTML = 'Description: ' + entry.description;
    modalCategory.innerHTML = 'Category: ' + entry.category;
    modalPrice.innerHTML = 'Price: $' + entry.price;
    modalSeller.innerHTML = 'Seller: ' + entry.seller;
    modalLocation.innerHTML = 'Location: ' + entry.latitude + ', ' + entry.longitude;
    modalContact.innerHTML = 'Contact: ' + entry.contact;
}

function clearList(listView)
{
    while (listView.firstChild)
        listView.removeChild(listView.firstChild);
}

addForm.addEventListener('submit',(e)=> {
    e.preventDefault();
    const formTitle = document.querySelector('#formTitle');
    const formDescription = document.querySelector('#formDescription');
    const formPrice = document.querySelector('#formPrice');
    const formCategory = document.querySelector('#formCategory');
    const formSeller = document.querySelector('#formSeller');
    const formLatitude = document.querySelector('#formLatitude');
    const formLongitude = document.querySelector('#formLongitude');
    const formContact = document.querySelector('#formContact');

    const post_request_object={
        "title": formTitle.value,
        "description": formDescription.value,
        "seller": formSeller.value,
        "category": formCategory.value,
        "price": formPrice.value,
        "latitude": formLatitude.value, 
        "longitude":  formLongitude.value,
        "contact": formContact.value
    }

    fetch('/items', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(post_request_object),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            getAllEntries()
            if (data._id !== undefined)
                alert('Item has been added.\nListing ID is: ' + data._id);
            else
                alert('There was an error adding the item.');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error adding the item.');
        });
})

deleteForm.addEventListener('submit',(e)=> {
    e.preventDefault();
    const formId = document.querySelector('#formId');

    fetch('items/' + formId.value, {method: 'DELETE'})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        getAllEntries()
        if (data.hasOwnProperty('deletedCount'))
            alert('Listing has been removed');
        else
            alert('Error removing listing');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error removing listing');
    });
})

getAllEntries();
