
//DOM ELEMENT
var locationGeohash = document.querySelector('#location_Geohash');
var editLocationGeohash = document.querySelector('#editLocation_Geohash');
// var addLocationForm = document.querySelector('#addLocationForm');
var errorLocationContent = document.querySelector('.error-location-content');
var arrMarkers = [];
var map;
var mapEdit;

//DELETE PREVOIUS MARKER FUNCTION
function deleteMarker() {
    for (var i = 0; i < arrMarkers.length; i++) {
        arrMarkers[i].setMap(null);
    }
    arrMarkers = [];
    editLocationGeohash.value = ' ';
    locationGeohash.value = ' ';
    // M.updateT extFields();
  };

//ADD MARKER FUNCTION
function addMarker(props){
    var marker = new google.maps.Marker({
            position: props.coords,
            map: props.ChooseMap
        });
    arrMarkers.push(marker);

    //infoWindow Testing trigger when marker is click
    // var infoWindow = new google.maps.InfoWindow({
    //     content: '<h1>Test</h1>'
    // });

    // marker.addListener('click', () => {
    //     infoWindow.open(map, marker);
    // });
    
    var lat  = props.coords.lat(); //get the latitude value
    var lng = props.coords.lng(); //get the longitude value
    var textCoords = lat.toString() + ', ' + lng.toString();
    
    /**Encode Coords to Geohash
     *  @param   {number} lat - Latitude in degrees.
     * @param   {number} lon - Longitude in degrees.
     * @param   {number} [precision] - Number of characters in resulting geohash.
     */
    // (Param => (lalitude, longitude, precision))
    var geohashValue = Geohash.encode(lat, lng, 8);
    console.log(geohashValue);

    //Draw and generate label for selected marker for geohash
    // drawCell(geohashValue);
    // drawLabel(geohashValue);

    /**Decode Geohash to Coords 
     * @param   {string} geohash */
    var coordsValue = Geohash.decode(geohashValue);
    console.log("before encode: ",textCoords);
    console.log("after decode: ",coordsValue);
    
    locationGeohash.value = geohashValue
    editLocationGeohash.value = geohashValue
    
    // M.updateTextFields();
}

// Initialize and ADD THE MAP
function initMap() {
     
    // The location of Uitm Perlis Map Options
    var options = {
            zoom:17,
            // center:{lat: 3.0652508, lng: 101.5060108} 
            center:{lat: 6.448831, lng: 100.279974} 
        }
    // The map, centered at Options var
    map = new google.maps.Map(document.getElementById('map'), options);
    mapEdit = new google.maps.Map(document.getElementById('mapEdit'), options);

    //For Map
    google.maps.event.addListener(map, 'click', (event) => {
        //Delete previous Marker
        deleteMarker();
      
        //Add Marker
        addMarker({coords:event.latLng,
                    ChooseMap:map});
    });

    //For Map Edit
    google.maps.event.addListener(mapEdit, 'click', (event) => {
        //Delete previous Marker
        deleteMarker();
      
        //Add Marker
        addMarker({coords:event.latLng,
                    ChooseMap:mapEdit});
    });

}

// addLocationForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     var locationName = addLocationForm['locationName'].value;
//     var locationGeohash = addLocationForm['locationGeohash'].value;

//     if(locationGeohash == ''){  
//         errorLocationContent.style.display = 'block';
//         //Remove the Error Message after 6 second
//         setTimeout(function () {
//             errorLocationContent.style.display = 'none';
//         }, 6000);
//     }
//     if(locationName != '' && locationGeohash != ''){
//         console.log('create database locaiton..');
//         // Add a new document with a generated id.
//         db.collection("location").add({
//             LocationName: locationName,
//             Geohash: locationGeohash
//         })
//         .then(function(docRef) {
//             // console.log("Document written with ID: ", docRef.id);
//             deleteMarker();
            
//             addLocationForm.reset(); 
//             errorLocationContent.style.display = 'none';
//             addLocationContent.style.display = 'none';
//             loginHomepage();
//         })
//         .catch(function(error) {
//             console.error("Error adding document: ", error);
//         });
//     }
    

// });

// //DRAW CELL FUNCTION
// let box = null;
// function drawCell(geohash) {
//     if (box) box.setMap(null);

//     const bounds = Geohash.bounds(geohash);

//     // google maps doesn't extend beyond ±85°
//     bounds.sw.lat = Math.min(Math.max(bounds.sw.lat, -85), 85);
//     bounds.ne.lat = Math.min(Math.max(bounds.ne.lat, -85), 85);

//     const boxBounds = new google.maps.LatLngBounds(
//             new google.maps.LatLng(bounds.sw.lat, bounds.sw.lon),
//             new google.maps.LatLng(bounds.ne.lat, bounds.ne.lon)
//     );
//     box = new google.maps.Rectangle({
//         bounds: boxBounds,
//         strokeColor: '#0000ff',
//         strokeOpacity: 0.8,
//         strokeWeight: 1,
//         fillColor: '#0000ff',
//         fillOpacity: 0.2
//     });
//     //console.log(box);
//     box.setMap(map);
//     map.fitBounds(box.bounds);
// }

// //DRAW LABEL FUNCTION
// let label;
// function drawLabel(geohash) {
//     const centre = Geohash.decode(geohash);

//     if (typeof label == 'undefined') {
//         label = new google.maps.InfoWindow({
//             maxWidth: 100
//         });
//     }
//     label.setContent(geohash);
//     label.setPosition(new google.maps.LatLng(centre.lat, centre.lon));
//     label.open(map)
// }