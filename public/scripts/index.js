// DOM ELEMENTS
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const mainContent = document.querySelector('.main-content');
const searchContent = document.querySelector('#search-content');
const noEvent = document.querySelector('#no-event-screen');
//CHECK IF THE USER LOGGED IN for Diffrent Nav Bar 
const setupUI = (user) => {

  if (user) {
    // arrayLocation.length = 0;
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
          const html = `
          <div>Logged in as ${user.email}</div>
          <div>${doc.data().bio}</div>
        `;
        accountDetails.innerHTML = html;
    })
    
    // toggle user UI elements
    loginHomepage();

  } else {
    mainContent.style.display = 'block';
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    searchContent.style.display = 'none';
    
  }
};





// DOM ELEMENTS FOR DISPLAY LIST OF DATA FROM FIRESTORE
const eventCardContent = document.querySelector('#event-card');
const eventCardList = document.querySelector('#event-card-list');

//setup events for user login and logout User Interface
const setupEvents = (data) => {
  if (data.length) {
    noEvent.style.display = 'none';
    let html = '';
    let dateCondition = '';
    
    data.forEach(doc => {
    var events = doc.data();
   

    //date retrieve condition
    if(events.eventDateStart == events.eventDateEnd){
      //showing event only for 1 days
      dateCondition = `<p>Date: ${events.eventDateStart}</p>`;
    
    }
    else{//showing event with 2 days or more
      dateCondition = `<p class="truncate">Date: ${events.eventDateStart} - ${events.eventDateEnd}</p>`;
    }  
    //create card list for each data in events collection
    var cardData = `
   
    <div class="container col s12 m6 l4">
      <div class="card hoverable z-depth-3 white">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator responsive-img" src="${events.eventPoster}" style="height:60%;"></div>
        <div class="card-content">
        <span class="card-title activator grey-text text-darken-4 truncate">${events.eventName}</span>`
          +dateCondition+
        `<p class="truncate">Time: ${events.eventTimeStart} - ${events.eventTimeEnd}</p>
          <p class="truncate">Category: ${events.eventCategory}</p>
          <p class="truncate">Location: ${events.eventLocation[0]}</p>
          <p class="truncate">Organizer: ${events.eventOrganizer}</p>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">
            <i class="material-icons right">close</i>${events.eventName}
          </span>
          <p>${events.eventDescription}</p>
        </div>
        <div class="card-action ">
            <button id="viewBtn" class="waves-effect waves-light btn-small blue darken-2 z-depth-0" type="submit" onclick="viewFunction('${doc.id}')">View</button>
            <button id="deleteBtn" data-target="modalDelete" class="waves-effect waves-light btn-small modal-trigger red darken-2 z-depth-0" onclick="deleteFunction('${doc.id}')">Delete</button>
        </div>
      </div>
    </div>
   
    `;
    
    html += cardData;
    
  });
 
    eventCardList.innerHTML = html;
  } else {
    noEvent.style.display = 'block';
    eventCardList.innerHTML = '';
  }
             
};


//DOM ELEMENT FOR UPDATE
var displayContent = document.querySelector('.dislpay-content');
var id = document.querySelector('#eventid');
var displayName = document.querySelector('#displayName');
var displayDate = document.querySelector('#displayDate');
var displayTime = document.querySelector('#displayTime');
var displayLocation = document.querySelector('#displayLocation');
var displayCategory = document.querySelector('#displayCategory');
var displayOrganizer = document.querySelector('#displayOrganizer');
var displaySpeaker  = document.querySelector('#displaySpeaker');
var displayDescription = document.querySelector('#displayDescription');
var displayPoster = document.querySelector('#displayPoster');
var displayFood = document.querySelector('#displayFood');
var displayCoupon = document.querySelector('#displayCoupon');
var displayFoodIcon = document.querySelector('#displayFoodIcon');
var displayCouponIcon = document.querySelector('#displayCouponIcon');
var displayContactName1 = document.querySelector('#displayContactName1');
var displayContactNumber1 = document.querySelector('#displayContactNumber1');
var displayContactName2 = document.querySelector('#displayContactName2');
var displayContactNumber2 = document.querySelector('#displayContactNumber2');
var displayInterested = document.querySelector('#displayInterested');

//DOM ELEM FOR GET CLICK .VALUE 
var editName = document.querySelector('#editName');
var editDateStart = document.querySelector('#editDateStart');
var editDateEnd = document.querySelector('#editDateEnd');
var editTimeStart = document.querySelector('#editTimeStart');
var editTimeEnd = document.querySelector('#editTimeEnd');
var editLocationName = document.querySelector('#editLocation_Name');
var editLocationGeohash = document.querySelector('#editLocation_Geohash');
var editCategory = document.querySelector('#editCategory');
var editOrganizer = document.querySelector('#editOrganizer');
var editSpeaker = document.querySelector('#editSpeaker');
var editContactName1 = document.querySelector('#editContactName1');
var editContactNumber1 = document.querySelector('#editContactNumber1');
var editContactName2 = document.querySelector('#editContactName2');
var editContactNumber2 = document.querySelector('#editContactNumber2');
var editDescription = document.querySelector('#editDescription');
var editFood = document.querySelector('#editFood');
var editCoupon = document.querySelector('#editCoupon');


//UPDATE FUNCTION
function viewFunction(ID){
  eventCardContent.style.display = 'none';
  searchContent.style.display = 'none';
  displayContent.style.display = 'block';
  
  var docRef = db.collection("events").doc(ID);
  
  docRef.onSnapshot(function(doc) {
    if (doc.exists) {
      
      var data = doc.data();
      var dateText = data.eventDateStart +' - '+ data.eventDateEnd;
      var timeText = data.eventTimeStart +' - '+ data.eventTimeEnd;
      var interestedText = data.eventInterested + ' Interested';
      
      //pass value to html tag
      id.value = doc.id;
      displayPoster.src = data.eventPoster;
      
      //update the marker for selected event for map view marker
      var geohashLocation = data.eventLocation[1];
      var coordsLocation = Geohash.decode(geohashLocation);
      var arrayCoordsLocation = Object.values(coordsLocation);

      //set the length arraymarker == 0
      deleteMarker();
      //create the marker inside the mapEdit MAP
      var marker = new google.maps.Marker({
        //position : { Latitude, Longitude}
        position: {lat: arrayCoordsLocation[0] ,lng: arrayCoordsLocation[1]},
        map: mapEdit
      });
      console.log(arrayCoordsLocation[0] +', ' +arrayCoordsLocation[1]);
      //push the marker to the arrayMarker
      arrMarkers.push(marker);


      //diplay data for 1st view update .innerHTML
      displayName.innerHTML = data.eventName;
      displayDate.innerHTML = dateText;
      displayTime.innerHTML = timeText;
      displayLocation.innerHTML = data.eventLocation[0];
      displayCategory.innerHTML = data.eventCategory;
      displayOrganizer.innerHTML = data.eventOrganizer;
      displaySpeaker.innerHTML = data.eventSpeaker;
      displayDescription.innerHTML = data.eventDescription;
      displayContactName1.innerHTML = data.contactPerson1[0];   //display name
      displayContactNumber1.innerHTML = data.contactPerson1[1]; //display number
      displayContactName2.innerHTML = data.contactPerson2[0];   //display name
      displayContactNumber2.innerHTML = data.contactPerson2[1]; //display number
      displayInterested.innerHTML = interestedText;

      
      if(data.foodAvailability == true){ 
          editFood.checked = 'checked';
          displayFoodIcon.textContent = 'check_circle';
          displayFoodIcon.style.color = 'green';
      }else{
          displayFoodIcon.textContent = 'cancel';
          displayFoodIcon.style.color = 'red';
      }
      if(data.couponAvailability == true){ 
          editCoupon.checked = 'checked';
          displayCouponIcon.textContent = 'check_circle';
          displayCouponIcon.style.color = 'green';      
      }else{
          displayCouponIcon.textContent = 'cancel';
          displayCouponIcon.style.color = 'red';      
      }


      //display data for edit button click .value
      editName.value = data.eventName;
      editDateStart.value = data.eventDateStart;  
      editDateEnd.value = data.eventDateEnd;
      editTimeStart.value = data.eventTimeStart;  
      editTimeEnd.value = data.eventTimeEnd;
      editLocationName.value = data.eventLocation[0];
      editLocationGeohash.value = data.eventLocation[1];
      editCategory.value = data.eventCategory;
      editOrganizer.value = data.eventOrganizer;
      editSpeaker.value = data.eventSpeaker;
      editContactName1.value = data.contactPerson1[0];
      editContactNumber1.value = data.contactPerson1[1];
      editContactName2.value = data.contactPerson2[0];
      editContactNumber2.value = data.contactPerson2[1];
      editDescription.value = data.eventDescription;
      

      //Update M. Function for fill the input 
      //Must at the bottom after pass value to html tag

      M.textareaAutoResize(editDescription);
      M.Datepicker.getInstance(editDateStart).setDate(new Date(data.eventDateStart));
      M.Datepicker.getInstance(editDateStart)._finishSelection(); 
      M.Datepicker.getInstance(editDateEnd).setDate(new Date(data.eventDateEnd));
      M.Datepicker.getInstance(editDateEnd)._finishSelection(); 
      M.updateTextFields();
 
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
      
  });
  
} // Update(eventID) closed function

//UPDATE CANCEL BUTTON
const updateModal = document.querySelectorAll('.updateModal');
const updateCancelBtn = document.querySelector('#updateCancelBtn');
updateCancelBtn.addEventListener('click', (e) => {
  updateModal.forEach(item => M.Modal.getInstance(item).close());
  
});

//UPDATE BUTTON FUNCTION EACH INFORMATION
//UPDATE EVENT NAME
const updateNameBtn = document.querySelector('#updateNameBtn');
updateNameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventName: editName.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})
//UPDATE EVENT DATE START AND DATE END
const updateDateBtn = document.querySelector('#updateDateBtn');
updateDateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventDateStart: editDateStart.value,
    eventDateEnd: editDateEnd.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT TIME START AND TIME END
const updateTimeBtn = document.querySelector('#updateTimeBtn');
updateTimeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventTimeStart: editTimeStart.value,
    eventTimeEnd: editTimeEnd.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT LOCATION
const updateLocationBtn = document.querySelector('#updateLocationBtn');
updateLocationBtn.addEventListener('click', (e) => {
  e.preventDefault();
  var editLocationUpperCase = editLocationName.value;
  editLocationUpperCase = editLocationUpperCase.toUpperCase();
  var eventRef = db.collection("events").doc(id.value);
  
  eventRef.update({
    eventLocation: [editLocationUpperCase, editLocationGeohash.value]
  })
  .then(function() {
      console.log("Document successfully updated!");
  
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT CATEGORY
const updateCategoryBtn = document.querySelector('#updateCategoryBtn');
updateCategoryBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventCategory: editCategory.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT ORGANIZER
const updateOrganizerBtn = document.querySelector('#updateOrganizerBtn');
updateOrganizerBtn.addEventListener('click', (e) => {
  e.preventDefault();

  var editOrganizerUpperCase = editOrganizer.value;
  editOrganizerUpperCase = editOrganizerUpperCase.toUpperCase();
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventOrganizer: editOrganizerUpperCase
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT SPEAKER
const updateSpeakerBtn = document.querySelector('#updateSpeakerBtn');
updateSpeakerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    eventSpeaker: editSpeaker.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT CONTACT PERSON 1
const updateContactPerson1Btn = document.querySelector('#updateContactPerson1Btn');
updateContactPerson1Btn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    contactPerson1: [editContactName1.value, editContactNumber1.value]
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE EVENT CONTACT PERSON 2
const updateContactPerson2Btn = document.querySelector('#updateContactPerson2Btn');
updateContactPerson2Btn.addEventListener('click', (e) => {
  e.preventDefault();
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    contactPerson2: [editContactName2.value, editContactNumber2.value]
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})


//UPDATE EVENT ADDITIONAL INFORMATION
var new_EditFood, new_EditCoupon; 
const updateAddInfoBtn = document.querySelector('#updateAddInfoBtn');
updateAddInfoBtn.addEventListener('click', (e) => {
  e.preventDefault();
  editFood = document.querySelector('#editFood');
  editCoupon = document.querySelector('#editCoupon');
  //get food and coupon value form checkbox
  new_EditFood = false;
  new_EditCoupon = false;
  if(editFood.checked){
    new_EditFood = true;
    displayFoodIcon.textContent = 'check_circle';
    displayFoodIcon.style.color = 'green';
  }else{
    displayFoodIcon.textContent = 'cancel';
    displayFoodIcon.style.color = 'red';
  }
  if(editCoupon.checked){
    new_EditCoupon = true;
    displayCouponIcon.textContent = 'check_circle';
    displayCouponIcon.style.color = 'green';      
  }else{
    displayCouponIcon.textContent = 'cancel';
    displayCouponIcon.style.color = 'red'; 
  }
  
  var eventRef = db.collection("events").doc(id.value);

  eventRef.update({
    foodAvailability: new_EditFood,
    couponAvailability: new_EditCoupon,
    eventDescription: editDescription.value
  })
  .then(function() {
      console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
})

//UPDATE IMAGE POSTER

var newEventNamePoster = document.querySelector('#newEventNamePoster');
var updatePosterBtn = document.querySelector('#updatePosterBtn');
updatePosterBtn.addEventListener('click', (e) => {
  //get event poster image
  //File or Blob named example.jpg
  var updateFilePoster = document.querySelector('#updateFilePoster');
  var newfile = updateFilePoster.files[0];

  var eventPosterRef = db.collection("events").doc(id.value);
  
  // valitation before deleting the old poster and then updte the new poster image
  if(newfile == null){  
    alert("Please insert image poster!");
    e.preventDefault();
  }

  //deleting the old poster and then update the new image poster
  else{
    
    eventPosterRef.get().then(function(doc) {
      var data = doc.data();
      
      //DELETING FILE IMAGES
      deleteFolderContents(data.eventPoster);
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('poster/'+ data.eventName +'-'+ newfile.name).put(newfile, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
          }, function(error) {

          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;

            case 'storage/canceled':
              // User canceled the upload
              break;

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
          }, function() {
              // Upload completed successfully, now we can get the download URL 
              uploadTask.snapshot.ref.getDownloadURL().then(function(newDownloadURL) {
                
                console.log('File available at', newDownloadURL); 

                eventPosterRef.update({
                    eventPoster: newDownloadURL
                })
                .then(function() {
                    console.log("Document successfully updated!");
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            });
          });

      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  
    }
});

  
  

  
const editBtn = document.querySelector('#editBtn');
const editContent = document.querySelectorAll('.edit-content');
const doneBtn = document.querySelector('#doneBtn');
const doneContent = document.querySelectorAll('.done-content');
const editModeClick = document.querySelectorAll('.edit-mode-click');
const defaultViewIcon = document.querySelectorAll('.default-view-icon');

//edit content will display when Edit Button is click
const editNameContent = document.querySelector('.edit-name-content');
const editDateContent = document.querySelector('.edit-date-content');
const editTimeContent = document.querySelector('.edit-time-content');
const editLocationContent = document.querySelector('.edit-location-content');
const editCategoryContent = document.querySelector('.edit-category-content');
const editOrganizerContent = document.querySelector('.edit-organizer-content');
const editSpeakerContent = document.querySelector('.edit-speaker-content');
const editDescriptionContent = document.querySelector('.edit-description-content');

doneBtn.addEventListener('click', (e)=>{
  editContent.forEach(item => item.style.display = 'block');
  defaultViewIcon.forEach(item => item.style.display = 'block');
  doneContent.forEach(item => item.style.display = 'none');
  editModeClick.forEach(item => item.style.display = 'none');
});

editBtn.addEventListener('click', (e) => {
  e.preventDefault();
  editContent.forEach(item => item.style.display = 'none');
  defaultViewIcon.forEach(item => item.style.display = 'none');
  doneContent.forEach(item => item.style.display = 'block');
  editModeClick.forEach(item => item.style.display = 'block');

});


const deleteConfirmBtn = document.querySelector('#deleteConfirmBtn');
const deleteEventName = document.querySelector('#delete-EventName');
const deleteCancelBtn = document.querySelector('#deleteCancelBtn');
const deleteID = document.querySelector('#deleteID');
var URLposter;
//DELETE FUNCTION MODAL TRIGEER
function deleteFunction(ID){

  var docRef = db.collection("events").doc(ID);
  docRef.get().then(function(doc) {
    
  var data = doc.data();
  URLposter = data.eventPoster;//GET EVENT NAME FOR DELETE FILE IMAGE

  deleteID.value = doc.id;
  deleteEventName.innerHTML = data.eventName;
  
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });

  var modalDelete = document.querySelector('#modalDelete');
  M.Modal.getInstance(modalDelete).close();
  deleteEventName.innerHTML = '';
  
}
//DELETE FUNCTION CONFRIM BUTTON CLICK
deleteConfirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  var ID = deleteID.value;
  console.log(ID);
  db.collection("events").doc(ID).delete().then(function() {
    console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    //DELETING FILE IMAGES
    deleteFolderContents(URLposter);
});

//DELETING FILE IMAGES FUNCTION FROM SELECTED EVENT
function deleteFolderContents(URLposter) {
  // Create a reference under which you want to list
  var listRef = storageRef.child('poster');
  //var fileURL = Storage.ref('poster');
  // Find all the prefixes and items.
  listRef.listAll().then(function(res) {
    // All the items under listRef.
    res.items.forEach(function(itemRef) { 
      itemRef.getDownloadURL().then(function(downloadURL) {
          if(URLposter == downloadURL){
            // Delete the file
            itemRef.delete().then(function() {
              console.log('File deleted successfully');
            }).catch(function(error) {
              // Uh-oh, an error occurred!
            });
          }
        
      });
    });
    
  }).catch(function(error) {
    // Uh-oh, an error occurred!
  });
}

//BACK HOMPAGE BUTTON CLICK FUNCTION
var backHomepage = document.querySelector('.return-homepage');
backHomepage.addEventListener('click', (e) => {
  e.preventDefault();
  //scroll the page to top
  window.scrollTo({top: 0, behavior: 'smooth' });
  deleteMarker();
  addEventContent.style.display = 'none';
  loginHomepage();
});


function loginHomepage(){

    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
    mainContent.style.display = 'none';
    displayContent.style.display = 'none';
    eventCardContent.style.display = 'block';
    searchContent.style.display = 'block';
}



// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  var sideNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sideNav);

  var parallax = document.querySelectorAll('.parallax');
  M.Parallax.init(parallax);


  var datepicker = document.querySelectorAll('.datepicker');
  M.Datepicker.init(datepicker, dateOptions = {
    //autoClose: false,
    //disableWeekends: 'false',
    format: 'mmm dd, yyyy',
    minDate: new Date(),
    defaultDate: new Date()

  });
  
  var timepicker = document.querySelectorAll('.timepicker');
  M.Timepicker.init(timepicker, timeOptions = {
    //autoClose: false,
    //twelveHour: false,
  });
  
  var select = document.querySelectorAll('select');
  M.FormSelect.init(select);

  var materialboxed = document.querySelectorAll('.materialboxed');
  M.Materialbox.init(materialboxed);

});

