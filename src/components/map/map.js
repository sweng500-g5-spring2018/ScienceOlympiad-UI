import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';


class Maps extends Component{
    divStyle = {
        width: '90%',
        height: '90%',
        position:'absolute',
        textAlign:'center'
    };

    onMarkerClick() {
        alert("GOOD JOB YOU FOUND PENN STATE WOOHOO.");
    }
    render() {
        return (
            <div id="map" style={this.divStyle}>
                <Map
                    style={{width: '70%', height: '100%', margin:'0px auto', display:'inline-block'}}
                    google={this.props.google}
                    initialCenter={{
                        lat: 40.798214,
                        lng: -77.859909
                    }}
                    zoom={12}
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
