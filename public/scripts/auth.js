
// listen for auth status changes
var userLoginID, currentUser;
const searchForm =  document.querySelector('#searchForm');
const allEvent = document.querySelector('#allEvent');
const upcomingEvent =  document.querySelector('#upcomingEvent');
const todayEvent =  document.querySelector('#todayEvent');
const previousEvent =  document.querySelector('#previousEvent');
/*var todayArr = [];
var upcomingArr = [];
var previousArr = [];
*/
auth.onAuthStateChanged(user => {
  if (user) {
    
    currentUser = firebase.auth().currentUser;
    if(currentUser != null){
      userLoginID = currentUser.uid;
    }
    setupUI(user);
    
    // db.collection("location").onSnapshot(function (documentSnapshots) {
    //   setupLocation(documentSnapshots.docs);
    // });
   /*
    db.collection('events')
    .where('userId', '==', userLoginID)
    .onSnapshot(snapshot => {
      setupEvents(snapshot.docs);
    }, err => console.log(err.message));
    */
   //GETTING DATA FROM DATABASE FOR STORING THE DATA 
   //FOR [UPCOMING | TODAY | PREVIOUS] EVENTS
   db.collection('events')
    .onSnapshot(snapshot => {
       /*empty the array each time there is a state change
       todayArr = [];
       upcomingArr = [];
       previousArr = [];
       */
      allEvent.style.color = "#2196f3";
      
      var data = snapshot.docs;
      if(data.length){
       
        data.forEach(doc => {
          var eventData = doc.data();
          var eventRef = db.collection("events").doc(doc.id);
          
          //Function to check bet 2 data is the same or not
          const isSameTime = (a, b) => {
            return a.getTime() === b.getTime();//return true if 2 date is same
          }

          var today = new Date();
          var todayFormat = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();
          var todayDate = new Date(todayFormat);
         
          var startDate = new Date(eventData.eventDateStart);
          var endDate =  new Date(eventData.eventDateEnd);

          //get the diff of date if its upcoming/previous events
          var dateDiff = todayDate < startDate ;

          //check if the events is more than 1 days
          var dateDiffMoreDays = isSameTime(startDate,endDate);
         
          //Check if event is happen today
          var todayDate = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate());
          var eventIsToday = isSameTime(startDate,todayDate);

          //Upcoming Event or Today Event
          if( dateDiff == true || eventIsToday == true){
            //Upcoming Event
            if(dateDiff == true){
              eventRef.update({
                eventStatus: 'UPCOMING'
              })
              .then(function() {
                  console.log("eventStatus successfully updated to UPCOMING!");
              })
              .catch(function(error) {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
            }
            //Today Event
            else if(eventIsToday == true){
              eventRef.update({
                eventStatus: 'TODAY'
              })
              .then(function() {
                  console.log("eventStatus successfully updated to TODAY!");
              })
              .catch(function(error) {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
           }
          }
           //Previous Event
          else if(dateDiff == false){

            //check if the start date and end date is the same 
            //or the event is for 1 day only where [dateDiffMoreDays == 0] 
            if(dateDiffMoreDays == true ){
              eventRef.update({
                eventStatus: 'PREVIOUS'
              })
              .then(function() {
                  console.log("eventStatus successfully updated to PREVIOUS!");
              })
              .catch(function(error) {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
              });
             
            }
            //check if the start date and end date is not the same 
            //or the event is more than 1 days where [dateDiffMoreDays != 0] 
            else if(dateDiffMoreDays == false ){
              var diffDate = endDate > todayDate;
              var todayDate = new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate());
              var dateDiffTodayAndEnd = isSameTime(endDate,todayDate);
              //Today Event
              if(diffDate == true || dateDiffTodayAndEnd == true){
                eventRef.update({
                  eventStatus: 'TODAY'
                })
                .then(function() {
                    console.log("eventStatus successfully updated to TODAY!");
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
              }

              //Previous Event
              else if(diffDate == false){
                eventRef.update({
                  eventStatus: 'PREVIOUS'
                })
                .then(function() {
                    console.log("eventStatus successfully updated to PREVIOUS!");
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
                //previousArr.push(eventData.eventName);
              }
            }
          }

        });
      }
    }, err => console.log(err.message));
    
    //GET DATA FOR All EVENTS
    allEvent.addEventListener('click', (e) => {
      e.preventDefault();
      searchForm.reset();
      allEvent.style.color = "#2196f3";
      upcomingEvent.style.color = "black";
      todayEvent.style.color = "black";
      previousEvent.style.color = "black";

      var first = db.collection("events")
      .where('userId', '==', userLoginID);

      return first.onSnapshot(function (documentSnapshots) {
        // Get the last visible document
        setupEvents(documentSnapshots.docs);
        // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        // // Construct a new query starting at this document,
        // // get the next 25 events.
        // var next = db.collection("events")
        //     .where('userId', '==', userLoginID)
        //     .where('eventStatus', '==', 'UPCOMING')
        //     .startAfter(lastVisible)
        //     .limit(9);
        });
    })

    //GET DATA FOR UPCOMING EVENTS
    upcomingEvent.addEventListener('click', (e) => {
      e.preventDefault();
      searchForm.reset();
      allEvent.style.color = "black";
      upcomingEvent.style.color = "#2196f3";
      todayEvent.style.color = "black";
      previousEvent.style.color = "black";
      
      var first = db.collection("events")
      .where('userId', '==', userLoginID)
      .where('eventStatus', '==', 'UPCOMING');
  
      return first.onSnapshot(function (documentSnapshots) {
        // Get the last visible document
        setupEvents(documentSnapshots.docs);
        // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        // // Construct a new query starting at this document,
        // // get the next 25 events.
        // var next = db.collection("events")
        //     .where('userId', '==', userLoginID)
        //     .where('eventStatus', '==', 'UPCOMING')
        //     .startAfter(lastVisible)
        //     .limit(9);
        });
    })

    //GET DATA FOR TODAY EVENTS
    todayEvent.addEventListener('click', (e) => {
      e.preventDefault();
      searchForm.reset();

      allEvent.style.color = "black";
      upcomingEvent.style.color = "black";
      todayEvent.style.color = "#2196f3";
      previousEvent.style.color = "black";

      var first = db.collection("events")
      .where('userId', '==', userLoginID)
      .where('eventStatus', '==', 'TODAY');
  
      return first.onSnapshot(function (documentSnapshots) {
        // Get the last visible document
        setupEvents(documentSnapshots.docs);
        // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        // // Construct a new query starting at this document,
        // // get the next 25 events.
        // var next = db.collection("events")
        //     .where('userId', '==', userLoginID)
        //     .where('eventStatus', '==', 'TODAY')
        //     .startAfter(lastVisible)
        //     .limit(9);
        });
    })

    //GET DATA FOR PREVIOUS EVENTS
    previousEvent.addEventListener('click', (e) => {
      e.preventDefault();
      searchForm.reset();
      
      allEvent.style.color = "black";
      upcomingEvent.style.color = "black";
      todayEvent.style.color = "black";
      previousEvent.style.color = "#2196f3";
      
      var first = db.collection("events")
      .where('userId', '==', userLoginID)
      .where('eventStatus', '==', 'PREVIOUS');
  
      return first.onSnapshot(function (documentSnapshots) {
        // Get the last visible document
        setupEvents(documentSnapshots.docs);
        // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
        // console.log("last", lastVisible);

        // // Construct a new query starting at this document,
        // // get the next 25 events.
        // var next = db.collection("events")
        //     .where('userId', '==', userLoginID)
        //     .where('eventStatus', '==', 'PREVIOUS')
        //     .startAfter(lastVisible)
        //     .limit(9);
        });
    })

   //SEARCHING FUNCTION
   searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var search = searchForm['searchData'].value;

    //get value encode for event name from soundex fucntion
    //Param: (String) Event Name, 
    //       (Int) No. of length encode value == 10(Max),
    //        (Int) CensusOption == 0 for enhanced soundex function
    var searchSoundexEncode = SoundEx(search, 4, 0);
    //Reset the search input
    searchForm['searchData'].value = null;

    var first = db.collection("events")
        .where('userId', '==', userLoginID)
        .where('keywordSoundex', '==', searchSoundexEncode );
      
        return first.onSnapshot(function (documentSnapshots) {
          // Get the last visible document
          setupEvents(documentSnapshots.docs);
          // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
          // console.log("last", lastVisible);
    
          // // Construct a new query starting at this document,
          // // get the next 9 events.
          // var next = db.collection("events")
          //     .where('userId', '==', userLoginID)
          //     .where('keywordSoundex', '==', searchSoundexEncode )
          //     .startAfter(lastVisible)
          //     .limit(9);
        });
    })


    //DEFAULT VALUE DISPLAY WHEN NO SEARCH WAS TRIGGER
    var first = db.collection("events")
      .where('userId', '==', userLoginID);
  
  
    return first.onSnapshot(function (documentSnapshots) {
      // Get the last visible document
      setupEvents(documentSnapshots.docs);
      // var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
      // console.log("last", lastVisible);

      // // Construct a new query starting at this document,
      // // get the next 25 events.
      // var next = db.collection("events")
      //     .where('userId', '==', userLoginID)
      //     .startAfter(lastVisible)
      //     .limit(9);
      });    
  } 
  else { //WHEN NO AUTH OR THE USER IS LOGOUT
    setupUI();
    setupEvents([]);
  }
});

//LOADING SCREEN WHEN ADDING EVENT
const loading = document.querySelector('#loading-screen');

// Create the file metadata for image upload
var metadata = {
  contentType: 'image/jpeg'
};

// ADDING DATA FUNCTION
const addEventForm = document.querySelector('#addEventForm');
addEventForm.addEventListener('submit', (e) => {  
  e.preventDefault();

  //get event value from addEventForm
  var eventname = addEventForm['eventName'].value;
  var speaker = addEventForm['speaker'].value;
  var description = addEventForm['description'].value
  var categoryOptions = addEventForm['category'].value;
  var locationName = addEventForm['location_Name'].value;
  var locationGeohash = addEventForm['location_Geohash'].value;
  var organizer = addEventForm['eventOrganizer'].value;
  var foodSelected = document.querySelector('#foodAvail');
  var couponSelected = document.querySelector('#couponAvail');
  var dateStart = addEventForm['dateStart'].value; 
  var dateEnd = addEventForm['dateEnd'].value;
  var timeStart = addEventForm['timeStart'].value; 
  var timeEnd = addEventForm['timeEnd'].value;
  var contactName_1 = addEventForm['contactName_1'].value;
  var contactNumber_1 = addEventForm['contactNumber_1'].value;
  var contactName_2 = addEventForm['contactName_2'].value;
  var contactNumber_2 = addEventForm['contactNumber_2'].value;

  //get food and coupon value form checkbox
  var food = false,coupon = false;
  if(foodSelected.checked){food = true;} 
  if(couponSelected.checked){coupon = true;}

  //uppercase data
  var locationNameUppercase = locationName.toUpperCase();
  var organizerUppercase = organizer.toUpperCase();

  //get value encode for event name from soundex fucntion
  //Param: (String) Event Name, 
  //       (Int) No. of length encode value == 10(Max),
  //        (Int) CensusOption == 0 for enhanced soundex function
  var soundexEncode = SoundEx(eventname, 4, 0);
  console.log(soundexEncode);
  
  //get event poster image
  //File or Blob named example.jpg
  var filePoster = document.querySelector('#filePoster');
  var file = filePoster.files[0];
  console.log(file);

  
  //validation
  if(locationGeohash == ''){  
    alert("Please select location by clicking at the Map above!");
    e.preventDefault();
  }

  else if(file == null){  
    alert("Please insert image poster!");
    e.preventDefault();
  }

  else{
  //Add event content
  addEventContent.style.display = 'none';
  //Display loading content
  loading.style.display = 'block';
 

  // Upload file and metadata to the object 'images/mountains.jpg'
  var uploadTask = storageRef.child('poster/'+ eventname +'-'+ file.name).put(file, metadata);

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
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            
            console.log('File available at', downloadURL); 

            db.collection('events').add({
              keywordSoundex: soundexEncode,
              userId: userLoginID,
              eventName: eventname,
              eventDateStart: dateStart,
              eventDateEnd: dateEnd,
              eventTimeStart: timeStart,
              eventTimeEnd: timeEnd,
              eventCategory: categoryOptions,
              eventLocation: [locationNameUppercase, locationGeohash],
              eventOrganizer: organizerUppercase,
              eventSpeaker: speaker,
              eventDescription: description,
              eventPoster: downloadURL,
              eventInterested: 0,
              contactPerson1: [contactName_1, contactNumber_1],
              contactPerson2: [contactName_2, contactNumber_2],
              foodAvailability: food,
              couponAvailability: coupon,
              eventStatus: 'UPCOMING',
              
            }).then(() => {
              //reset the add event form
              addEventForm.reset();

              //scroll the page to top
              window.scrollTo({top: 0, behavior: 'smooth' });

              loading.style.display = 'none';
      
              //guideList.style.display = 'block';
              eventCardContent.style.display = 'block';
              searchContent.style.display = 'block';

            }).catch(err => {
              console.log(err.message);
            });
        });
      });
    }
});


// //LOCATION DROPDOWN FUCNTION 
// var locationSelect = document.querySelector('#location');
// var select = document.querySelectorAll('select');


// //Get Data Location and Push into 'arrayLocation' Array
// var arrayLocation = [];
// db.collection("location").onSnapshot(function(querySnapshot) {
//         arrayLocation.push("Choose Location");
//         querySnapshot.forEach(function(doc) {
//           arrayLocation.push(doc.data().LocationName);
//         });
//         while (locationSelect[0]) locationSelect[0].parentNode.removeChild(locationSelect[0])
// });


//HOME FUNCTION NAVBAR
const home = document.querySelectorAll('#home');
home.forEach(item => item.addEventListener('click', (e) => {
    window.location.reload();
    noEvent.style.display = 'none';
  })
);

//ADD EVENT CONTENT NAVBAR
const addEvent = document.querySelectorAll('#addNewEvent');
const addEventContent = document.querySelector('.add-event-content');
addEvent.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // var select = document.createElement('select');
      // TODO: 17/9/2019 
      // var selectOption;

      // for(let i=0;i < arrayLocation.length;i++){
      //   console.log(arrayLocation[i]);

      //     //default choose location
      //   if(arrayLocation[i] == "Choose Location"){
      //     selectOption = document.createElement('option'); 
      //     selectOption.innerHTML = arrayLocation[i];
      //     selectOption.setAttribute("disabled","");
      //     selectOption.setAttribute("selected","");
      //     locationSelect.appendChild(selectOption);
      //   }
      //   else{
      //     selectOption = document.createElement('option'); 
      //     selectOption.value = arrayLocation[i];
      //     selectOption.innerHTML = arrayLocation[i];
      //     locationSelect.appendChild(selectOption);
      //   }
        
      // }
      // //Initialize the Select Element
      // M.FormSelect.init(select);
      // arrayLocation.length = 0;
      
      

      // //reset from Add New Location Form
      deleteMarker();
      // addLocationForm.reset(); 
      
      //Close Side Nav after Modal Login is Open
      const sideNav = document.querySelector('#sidenav-slide');
      M.Sidenav.init(sideNav).close();
      noEvent.style.display = 'none';
      addEventContent.style.display = 'block';
      //addLocationContent.style.display = 'none';
      eventCardContent.style.display = 'none';
      searchContent.style.display = 'none';
      displayContent.style.display = 'none';
  })
);


// //ADD LOCATION CONTENT NAVBAR
// const addLocation = document.querySelectorAll('#addNewLocation');
// const addLocationContent = document.querySelector('.add-location-content');
// addLocation.forEach(item => item.addEventListener('click', (e) => {
//       e.preventDefault();

//       //reset from Add New Event Form 
//       addEventForm.reset();

//       //set array Location to null
//       //arrayLocation.length = 0;

//       //Close Side Nav after Modal Login is Open
//       const sideNav = document.querySelector('#sidenav-slide');
//       M.Sidenav.init(sideNav).close();

//       addLocationContent.style.display = 'block';
//       addEventContent.style.display = 'none';
//       eventCardContent.style.display = 'none';
//       searchContent.style.display = 'none';
//       displayContent.style.display = 'none';

//   })
// );

 //SIGNUP FUNCTION
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
    
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();

  });
});

// LOGOUT FUNCTION
const logout = document.querySelectorAll('#logout');
logout.forEach(item => item.addEventListener('click', (e) => {
    e.preventDefault();
    //scroll the page to top
    window.scrollTo({top: 0, behavior: 'smooth' });
    //Close Side Nav after Modal Login is Open
    const sideNav = document.querySelector('#sidenav-slide');
    M.Sidenav.init(sideNav).close();
    
    auth.signOut();

    //reset from Add New Event and Add New Location Form 
    addEventForm.reset();
    noEvent.style.display = 'none';
    addEventContent.style.display = 'none';
    
  })
);


// LOGIN FUNCTION
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    loginForm.querySelector('.error').innerHTML = '';
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    //close sidenav
    const sideNav = document.querySelector('#sidenav-slide');
    M.Sidenav.init(sideNav).close();
    
  }).catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
  });

})

const loginModal = document.querySelectorAll('#loginModal');
//LOGIN MODAL
loginModal.forEach(item => item.addEventListener('click', (e) => {
      e.preventDefault();
      //Close Side Nav after Modal Login is Open
      const sideNav = document.querySelector('#sidenav-slide');
      M.Sidenav.init(sideNav).close();
  })
);

