import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import NotificationSystem from 'react-notification-system';

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
        return (
            <div id="map" >
                <Map
                    style={this.divStyle}
                    google={this.props.google}
                    initialCenter={{
                        lat: 40.798214,
                        lng: -77.859909
                    }}
                    zoom={13}
                    clickableIcons={false}
                >
                    <Marker onClick={this.onMarkerClick}
                        name={'Current location'}
                    />
                </Map>
            </div>
        );
    }

}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(Maps)
