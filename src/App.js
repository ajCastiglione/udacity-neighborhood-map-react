import React, {Component} from 'react';
import Locations from './components/Locations';

export default class App extends Component {

    constructor() {
        super();
        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    state = {
        POIs: [
            {
                'name': "Brookfield Country Club",
                'type': "Country Club",
                'latitude': 42.983928,
                'longitude': -78.666017,
                'streetAddress': "5120 Shimerville Rd, Clarence, NY 14031"
            },
            {
                'name': "Clarence Public Library",
                'type': "Library",
                'latitude': 42.9950515,
                'longitude': -78.6407332,
                'streetAddress': "3 Town Pl, Clarence, NY 14031"
            },
            {
                'name': "Premier Place",
                'type': "Store",
                'latitude': 42.98435509999999,
                'longitude': -78.6984052,
                'streetAddress': "7980 Transit Rd, Williamsville, NY 14221"
            },
            {
                'name': "Platinum Health & Fitness",
                'type': "Gym",
                'latitude': 43.026843,
                'longitude': -78.69798329999999,
                'streetAddress': "4685 Transit Rd, Buffalo, NY 14221"
            },
            {
                'name': "Santora's Pizza Pub & Grill",
                'type': "Restaurant",
                'latitude': 42.980571,
                'longitude': -78.6977952,
                'streetAddress': "7800 Transit Rd, Williamsville, NY 14221"
            }
        ],
        map: '',
        infowindow: '',
        prevmarker: ''
    };

    componentDidMount() {
        // Connect the initMap() function within this class to the global window context
        window.initMap = this.initMap;
        // Initialize the maps script, passing in the url
        loadMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyDqE8dflRzjIvF4EyTxmOjZQFJxBEUaNWM&callback=initMap')
    }

    /* Initialize the map once the script is loaded */
    initMap() {
        var self = this;
        
        let mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        const map = new window.google.maps.Map(mapview, {
            center: {lat: 42.9892679, lng: -78.6867633},
            zoom: 14,
            mapTypeControl: false
        });

        let InfoWindow = new window.google.maps.InfoWindow({});
        
        this.setState({ map: map, infowindow: InfoWindow });

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        let allLocations = [];
        this.state.POIs.forEach(function (location) {
            let longname = `${location.name} - ${location.type}`;
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            allLocations.push(location);
        });
        this.setState({ POIs: allLocations });
    }

    /* Open the infowindow for the selected marker */
    openInfoWindow (marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({ prevmarker: marker });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /* Gather the info from foursquare's api, display it in the infowindow */
    getMarkerInfo(marker) {
        let self = this;
        let id = "LZRKL1G5SVWIFW44BW5CCNYQFA1LU0DA2NRBFGTGGFYNQNW4";
        let secret = "JZJYNB3C5S3CEL0AJ2ZKRPPNDPATTJWVKHDC4W12M02UK2TW";
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20130815&ll=${marker.getPosition().lat()},${marker.getPosition().lng()}&limit=1`;
        
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent(`Sorry for the delay, we encountered an error fetching this url -> ${url}. Please try again`);
                        return;
                    }

                    // Parse the response in json format
                    response.json().then( (data) => {
                        let location_info = data.response.venues[0],
                        nameOfPlace = `<strong>Location: </strong> ${(location_info.name ? location_info.name : 'Not Listed')} <br>`,
                        verified = `<strong>Verified Location: </strong> ${(location_info.verified ? 'Yes' : 'No')} <br>`,
                        category = `<strong>Category: </strong>  ${location_info.categories[0].name} <br>`,
                        location_address = `<strong>Address: </strong> ${location_info.location.address} <br>`,
                        readMore = `<a class="learn-more-btn" href="https://foursquare.com/v/${location_info.id}" target="_blank">Learn more</a>`;
                        self.state.infowindow.setContent(nameOfPlace + category + location_address + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Error loading data from API", err);
            });
    }

    /* Close the infowindow */
    closeInfoWindow () {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({ prevmarker: '' });
        this.state.infowindow.close();
    }

    render() {
        return (
            <main>

                <Locations 
                POIs={this.state.POIs} 
                openInfoWindow={this.openInfoWindow}
                closeInfoWindow={this.closeInfoWindow}
                />

                <div id="map"></div>

            </main>
        );
    }
}

/* Load the map */
function loadMap(src) {
    const local = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Error trying to load the map, please try again.");
    };
    local.parentNode.insertBefore(script, local);
}