import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

class Maps extends Component{

    constructor(props) {
        super(props);

        this.divStyle = {
            height: '700px',
            width: '700px',
            position: 'relative'
        };

        this.state = {
            lat: undefined,
            lng: undefined,
        };
    }

    onMapClicked = (mapProps, map, event) => {

        this.setState({
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        });
    }

    addMarker = () => {
        if (this.state.lat !== undefined)
            return(<Marker name={'Current location'} position={{lat: this.state.lat, lng: this.state.lng}}/>);
    }

    render() {
        return <div id="map">
            <Map
                style={this.divStyle}
                google={this.props.google}
                zoomControl={true}
                initialCenter={{
                    lat: 41.306610,
                    lng: -76.015437
                }}
                zoom={17}
                onClick={this.onMapClicked}
                clickableIcons={false}>
                {this.addMarker()}
            </Map>
        </div>;
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(Maps)
