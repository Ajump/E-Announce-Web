// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config.firebase);
// Get a database reference to our blog
var db = admin.database();

//Trigger when a document added in CLoud Firestore
exports.createEvent = functions.firestore
    .document('events/{eventsId}').onCreate((snap, context) => {
      // Get an object representing the document
      const newValue = snap.data();

      if(newValue.eventStatus === "UPCOMING"){
          
        var userRef = db.ref("server/saving-data/fireblog/users");
        // // Attach an asynchronous callback to read the data at our posts reference
        var registrationTokens = [];
        userRef.on("value", function(snapshot) {
            console.log(snapshot.val());
            
            //Get the users token ID as a child node from users
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.val();
                var tokenId = data.TokenId;
                console.log(tokenId);
                registrationTokens.push(tokenId);
            
            });
              // access a particular field as you would any JS property
              var name = newValue.eventName;
              var date = newValue.eventDateStart;
              var location = newValue.eventLocation[0];
              var time = newValue.eventTimeStart +' - '+  newValue.eventTimeEnd;
              var textBody = name +'\n'+ date +'\n'+ time +'\n'+ location;
  
              // This registration token comes from the client FCM SDKs.
              console.log(registrationTokens);
              
              //Mesasage content for notification
              var message = {
                  data: {
                      title: 'New Upcoming Event!!',
                      body: textBody
                  },
                  tokens: registrationTokens,
              };
              // Send a message to the device corresponding to the provided
              // registration token.
              return admin.messaging().sendMulticast(message)
                  .then((response) => {
  
                      if (response.failureCount > 0) {
                          const failedTokens = [];
                          response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                              failedTokens.push(registrationTokens[idx]);
                            }
                          });
                          console.log('List of tokens that caused failures: ' + failedTokens);
                        }
                        else{
                            console.log(response.successCount + ' messages were sent successfully');
                        }
                  })
                  .catch((error) => {
                      console.log('Error sending message:', error);
                  });
              
  
          },function (errorObject) {
              console.log("The read failed: " + errorObject.code);
          });
          //set array to null
          registrationTokens.length = 0;

      }
        
    });


//Trigger when a document change in Cloud Firestore
exports.updateEvent = functions.firestore
    .document('events/{eventsId}').onUpdate((change, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = change.after.data();
      // ...or the previous value before this update
      const previousValue = change.before.data();
     
        // access a particular field as you would any JS property
        // const name = newValue.name;

    
    if (previousValue.eventStatus === "UPCOMING" && newValue.eventStatus === "TODAY") {
        var userRef = db.ref("server/saving-data/fireblog/users");
        // // Attach an asynchronous callback to read the data at our posts reference
        var registrationTokens = [];
        userRef.on("value", function(snapshot) {
            console.log(snapshot.val());
            
            //Get the users token ID as a child node from users
            snapshot.forEach(function(childSnapshot) {
                var data = childSnapshot.val();
                var tokenId = data.TokenId;
                console.log(tokenId);
                registrationTokens.push(tokenId);
            
            });

            var location = newValue.eventLocation[0];
            var time = previousValue.eventTimeStart +' - '+  previousValue.eventTimeEnd;
            var textBody = time +'\n'+ location;

            // This registration token comes from the client FCM SDKs.
            console.log(registrationTokens);
            
            //Mesasage content for notification
            var message = {
                data: {
                    title: previousValue.eventName,
                    body: textBody
                },
                tokens: registrationTokens,
            };
            // Send a message to the device corresponding to the provided
            // registration token.
            return admin.messaging().sendMulticast(message)
                .then((response) => {

                    if (response.failureCount > 0) {
                        const failedTokens = [];
                        response.responses.forEach((resp, idx) => {
                          if (!resp.success) {
                            failedTokens.push(registrationTokens[idx]);
                          }
                        });
                        console.log('List of tokens that caused failures: ' + failedTokens);
                      }
                      else{
                          console.log(response.successCount + ' messages were sent successfully');
                      }
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        //set array to null
        registrationTokens.length = 0;
    }
    
});



