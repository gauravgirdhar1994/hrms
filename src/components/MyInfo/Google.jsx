import React, { Component, Fragment } from 'react';
import { Modal, Button, Card, Table, Form } from "react-bootstrap";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import axios from "axios";
import config from "../../config/config";
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");


class Google extends Component {
  static defaultProps = {
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key="+config.Google_Map_API+"&callback=initMap",
//     googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
}
    constructor(props) {
      super(props);
      this.state = {
        googleMarker:this.props.Markers,
        openInfoWindowMarkerId: ''
    }
    }
  }

  handleToggleOpen = (markerId) => {
    this.setState({
      openInfoWindowMarkerId: markerId
    });
  }

  MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={9}
      // defaultCenter={{ lat: 25.2048, lng: 55.2708 }}
      defaultCenter={{ lat: 25.1810198, lng: 55.3086086 }}
    >
      {this.props.Markers.map(marker => (
        this.props.isMarkerShown && <Marker
          key={marker.id}
          onClick={() => this.handleToggleOpen(marker.id)}
          position={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }}

        />

      ))}
    </GoogleMap>
  ))



  render() {
    console.log('Google maps', this.props.Markers, this.props.isMarkerShown);
    if (Object.keys(this.props.Markers).length > 0) {

      return (
        <Fragment>
          <this.MyMapComponent
            googleMapURL={this.props.googleMapURL}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          >
          </this.MyMapComponent>
        </Fragment>
      )
    }

    return '';

  }

}
export default Google;
