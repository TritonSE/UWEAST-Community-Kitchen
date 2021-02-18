/**
 * Component creating the map on the contact page. Renders a map utilizing the 
 * Google Maps API centered above UWEAST location. Also renders an infobox with 
 * information with email, address, and phone number over that location.
 * 
 * @summary   Map that shows up on the contact page with Google Maps API.
 * @author    Navid Boloorian
 */

import React, {useState, useEffect} from 'react';
import {
  GoogleMap,
  useLoadScript,
  InfoWindow
} from "@react-google-maps/api";

const config = require('../config');
const BACKEND_URL = config.backend.uri;

const mapContainerStyle = {
  width: "100%",
  height: "100%"
}

// latitude/longitude is slightly offset to account for the infobox size
const center = {
  lat: 32.75871130774189, 
  lng: -117.05553043117615
}

const options = {
  // hide all Google UI
  disableDefaultUI: true,
  gestureHandling: "greedy"
}

const ContactMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: config.google.MAPS_API_CODE
  })

  // used to adjust the email in the infobox
  const [contactEmail, setContactEmail] = useState("none"); 

  /**
   * UseEffect gets the primary email from the database and sets the state 
   * email variable to that primary email.
   */
  useEffect(() => {
    fetch(`${BACKEND_URL}/email/all`)
    .then(async result => {
      if (result.ok) {
        const json = await result.json();

        // get the first email in the db if it exists
        if(json.emails !== undefined && json.emails.length > 0) {
          setContactEmail(json.emails[0].email);
        }
      }
      else {
        console.log("error");
      }
    })
  }, []);

  if(loadError) return "error loading";
  if(!isLoaded) return "loading...";

  return (
    <>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}options={options}>
        <InfoWindow position={{lat: 32.75471130774189, lng: -117.05553043117615}}>
          {/** conditionally render email only if one is found in db */}
          <div className="info-wrapper">
            {
              contactEmail !== "none" ? 
              (
                <>
                  <p className="info-label">Email us at</p>
                  <p className="info-value">{contactEmail}</p>
                </>
              ) :
              null
            }
            
            <p className="info-label">Call us at</p>
            <p className="info-value">(619) 831-7883</p>
            <p className="info-label">Find us at</p>
            <p className="info-value">6523 University Ave <br/> San Diego, CA 92115</p>
          </div>
        </InfoWindow>
      </GoogleMap>
    </>
  )
}

export default ContactMap;