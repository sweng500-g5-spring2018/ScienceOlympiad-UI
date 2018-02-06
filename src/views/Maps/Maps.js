import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

class Maps extends Component{
    divStyle = {
        height: '700px',
        width: '700px',
        position: 'relative'
    };

    onMarkerClick() {
        alert("WOW YOU FOUND PENN STATE GOOD FOR YOU.");
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
                clickableIcons={false}
            >
                <Marker onClick={this.onMarkerClick}
                        name={'Current location'}
                />
            </Map>
        </div>;
    }

}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(Maps)
