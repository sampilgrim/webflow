

//not currently using this location script since we want to just load all content in map view at the start
//this needs tidying up

// var latitude;
// var longitude;
// function geoip(json){
//     latitude = json.latitude;
//     longitude = json.longitude;
//     console.log("latitude is " + latitude);
//     }

// load map when DOM loaded
window.addEventListener('DOMContentLoaded', function() {

    // basic way of initializing, where we also set a view and zoom level
    // var map = L.map('map').setView([51.505, -0.09], 13);

    // initialize map without setting a view or zoom
    var map = L.map('map', // reference the id of the HTML element to hold this map
        {
            attributionControl: false // hide the leaflet attribution for a clean map. If you do this be sure to include the attribution elsewhere on the page or site in order to obey the copyright requirements of your basemap provider.
        }) 

    


    // load tiles 
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18, // set the maximum zoom level
        id: 'mapbox/light-v10', // choose your map theme or create your own https://docs.mapbox.com/api/maps/styles/
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic2FtcGlsZ3JpbSIsImEiOiJja25yeDhvdmowZGQ2Mm5wamxjZDdxdmxyIn0.bpw21rkrdas581Gexlopsw' //you will need to replace this with your own access token
    }).addTo(map);


    // define a custom marker pin
    var officeIcon = L.icon({
        iconUrl: 'https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f6760cb9aa7941c2a0db_exus-icon-pin-02.png',
        shadowUrl: 'https://uploads-ssl.webflow.com/5fc51706f820e1f30a3d5ec9/6009f01da1ed9aa45b97a43b_exus-icon-pin-shadow-02.png',
        iconSize: [36, 64], // size of the icon
        shadowSize: [53, 34], // size of the shadow
        iconAnchor:   [18, 64], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 34],  // the same for the shadow
        popupAnchor:  [0, -68] // point from which the popup should open relative to the iconAnchor
        });


 
    //****************************************//
    //Get office markers
    
    /*
    All fields are loaded into the myData object by the Webflow embed script, but we can't load the address properly if it contains line breaks.
    Instead we load the address from a hidden text element in the DOM. A sibling text element contains the office name, which we can match against.
    */

    //array to hold office markers
    myData.officemarkers = [];

    //first get all elements in DOM with the office name class
    var officeNameElArr = document.querySelectorAll(".data-text--office-name");

    //loop through offices
    for (let j = 0; j < myData.offices.length; j++) {
        var myOffice = myData.offices[j];
        //loop through office name elements
        for (let i = 0; i < officeNameElArr.length; i++) {
            //if the name of the office in the DOM element matches our current office
            if(officeNameElArr[i].innerHTML == myOffice.name) { 
                //get the sibling element which we hope contains the address text. Check it has the right class. 
                var officeAddressEl = officeNameElArr[i].nextElementSibling;
                while (officeAddressEl) {
                    if (officeAddressEl.matches(".data-text--office-address")) break;
                    officeAddressEl = officeAddressEl.nextElementSibling;
                }
            }
        }
        //update myData obj with address
        myOffice.address = officeAddressEl.innerHTML;
        //convert string coords to latlong array - unclear if necessary ***
        myOffice.latlong = L.latLng(myOffice.latitude, myOffice.longitude);

        //popup v2
        myData.officePopup = "<div class='exus-popup__content'><div class='exus-popup__head'>" + myOffice.name + "</div><a href='/contact' class='exus-popup__link'>Contact</a></div>";
        myData.customPopupOptions = {
            'maxWidth': '500',
            'className': 'exus-popup'
        }

        //put a pin in it and bind popup
        myOffice.marker = L.marker(myOffice.latlong, {icon: officeIcon}).bindPopup(myData.officePopup, myData.customPopupOptions);
        //also push this marker into an array
        myData.officemarkers.push(myOffice.marker);

    }

    //create layer group for office markers (think this is just a layer, but is a group of markers)
    myData.layers = {};
    myData.layers.offices = L.layerGroup(myData.officemarkers).addTo(map);

    //create feature group for getting the bounds of all markers (seems unecessary to have to do this as well as a layer group...)
    var myFeatureGroup = L.featureGroup(myData.officemarkers);

    //fit map to bounds of feature group 
    //https://stackoverflow.com/questions/16845614/zoom-to-fit-all-markers-in-mapbox-or-leaflet
    map.fitBounds(myFeatureGroup.getBounds().pad(0.05)); 


    //****************************************//
    //custom control for holding capacity information about country
    myData.capControl = L.control(
        {
            position: 'bottomleft'
        });

    //create control
    myData.capControl.onAdd = function (map) {
        //parent div
        this.div = L.DomUtil.create("div", "capControl");
        //heading
        this.name = L.DomUtil.create("div", "capControl__name", this.div); //header obj
            this.name.innerHTML = "Select a country to see capacity";
        //total capacity
        this.capacity = L.DomUtil.create("div", "capControl__cap", this.div); //capacity obj
            this.capacity.style.display="none"; //hide capacity for the moment
        //create elements for each capacity type
        for(let i = 0; i < myData.energyTypes.length; i++) {
            this["capacityRow_" + myData.energyTypes[i]] = L.DomUtil.create("div", "capControl__capRow", this.div);
            this["capacityType_" + myData.energyTypes[i]] = L.DomUtil.create("div", "capControl__capRow__type", this["capacityRow_" + myData.energyTypes[i]]);
            this["capacityValue_" + myData.energyTypes[i]] = L.DomUtil.create("div", "capControl__capRow__value", this["capacityRow_" + myData.energyTypes[i]]);
            this["capacityRow_" + myData.energyTypes[i]].style.display="none"; //hide row for the moment
        }
        //button to see child states
        this.button = L.DomUtil.create("button", "capControl__btn", this.div); //button obj
        //this.update(); //don't think any point update yet as we don't have a country yet
        return this.div; //onAdd() must return an instance of HTML Element representing the control
    }

    //update control when a state or country is clicked on
    myData.capControl.update = function (countryOrState, featureType) {
        if(countryOrState) {
            this.name.innerHTML = countryOrState.name;
            this.capacity.innerHTML = countryOrState.capacityTotal + " MW";
            this.capacity.style.display=""; //show
            for(let i = 0; i < myData.energyTypes.length; i++) {
                this["capacityRow_" + myData.energyTypes[i]].style.display=""; //show
                this["capacityType_" + myData.energyTypes[i]].innerHTML = myData.energyTypes[i];
                this["capacityValue_" + myData.energyTypes[i]].innerHTML = countryOrState["capacity" + myData.energyTypes[i]] + " MW";
                //if no capacity for this energy type, hide
                if(countryOrState["capacity" + myData.energyTypes[i]] == 0) {
                    this["capacityRow_" + myData.energyTypes[i]].style.display="none";
                }
            }


            //if we click on a country, show "see states"
            if(featureType=="country") {
                if(countryOrState.states) { //if this country has some states, show the button
                    this.button.innerHTML = "See states";
                    this.button.style.display = "inline-block";

                }
                else { //if this country has no states, hide the button
                    this.button.innerHTML = "";
                    this.button.style.display = "";
                }
            }
            if(featureType=="state") {
                this.button.innerHTML = "See countries";
                this.button.style.display = "inline-block";
            }
        }
    }

    //add control to map
    myData.capControl.addTo(map);
    //****************************************//


    //****************************************//
    //styling function
    function styleStates(feature) {
        return {
            fillColor: "#009cb8",
            weight: 2,
            opacity: 1,
            color: 'white',
            //dashArray: '3',
            fillOpacity: 0.7
        };
    }
    //****************************************//


    //****************************************//
    //interactivity

    //on mouseover
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    //mouseout
    function resetHighlightState(e) {
        var layer = e.target;
        //myData.layers.states.resetStyle(e.target);
        myData.layers.states.setStyle(styleStates); //this is wrong, really the reset is the way to go, but it keeps resetting to the default style.
    }
    function resetHighlightCountry(e) {
        var layer = e.target;
        //myData.layers.countries.resetStyle(e.target);
        myData.layers.countries.setStyle(styleStates);
        //put states back on top
        myData.layers.states.bringToFront();
    }

    //click to zoom
    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    //function for country click
    function clickOnCountry(e) {
        //zoom to country
        zoomToFeature(e);
        //hide offices
        //map.removeLayer(myData.layers.offices);
        //update control. This passes a properties obj back to update function for control element, and we also tell the update function this is a country
        myData.capControl.update(e.target.feature.properties, "country");
    }

    //function for country click
    function clickOnState(e) {
        //zoom to state - we've turned this off since it makes moving quickly between many states difficult
        //zoomToFeature(e);
        //hide offices - turning this off to simplify map behaviour
        //map.removeLayer(myData.layers.offices);
        //update control. This passes a properties obj back to update function for control element, and we also tell the update function this is a state 
        myData.capControl.update(e.target.feature.properties, "state");
    }

    //click on button to show states
    function showStatesHideCountries() {
        if (map.hasLayer(myData.layers.countries)) map.removeLayer(myData.layers.countries);
        if (!map.hasLayer(myData.layers.states)) map.addLayer(myData.layers.states);
        //toggle button back to countries
        myData.capControl.button.innerHTML = "See countries";
    }

    //click on button to show countries
    function showCountriesHideStates() {
        if (map.hasLayer(myData.layers.states)) map.removeLayer(myData.layers.states);
        if (!map.hasLayer(myData.layers.countries)) map.addLayer(myData.layers.countries);
        //toggle button back to states
        myData.capControl.button.innerHTML = "See states";
    }

    //event handler for button
    myData.capControl.button.onclick = function(e) {
        if(myData.capControl.button.innerHTML=="See states") showStatesHideCountries();
        else if(myData.capControl.button.innerHTML=="See countries") showCountriesHideStates();
        console.log(myData.capControl.button.value)
        e.stopPropagation(); //stop click action bubbling to map behind control
    };

    //listeners
    function onEachFeatureState(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlightState,
            click: clickOnState
        });
    }

    function onEachFeatureCountry(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlightCountry,
            click: clickOnCountry
        });
    }
    //****************************************//


    //****************************************//
    //create layers and pass data

    //new GeoJSON layers for states and countries
    myData.layers.states = L.geoJSON(
        false, //no data yet
        {
            onEachFeature: onEachFeatureState
        });//don't add states layer yet

    myData.layers.countries = L.geoJSON(
        false, //no data yet
        {
            onEachFeature: onEachFeatureCountry
        }).addTo(map);

    //add geojson objects to layers
    for (let i = 0; i < myData.states.length; i++) {
        myData.layers.states.addData(myData.states[i]);
    }
    for (let i = 0; i < myData.countries.length; i++) {
        myData.layers.countries.addData(myData.countries[i]);
    }

    //at the moment both layers the same col, will change
    myData.layers.states.setStyle(styleStates);
    myData.layers.countries.setStyle(styleStates);

    //we could have defined this second, but just to demonstrate method
    myData.layers.states.bringToFront();
    //****************************************//


    //****************************************//
    //Layer control element

    //create obj containing all layers we wish to control, and add a control element. If layer has already been added to map, this will be autoticked.
    var overlayMaps = {
        "States": myData.layers.states,
        "Countries": myData.layers.countries,
        "Offices": myData.layers.offices
    };
    //var layerControl = L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);
    //layerControl.collapsed = false;
    //****************************************//


})