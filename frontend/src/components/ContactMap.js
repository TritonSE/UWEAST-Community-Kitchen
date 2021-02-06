import React from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%"
}

const center = {
  lat: 32.75871130774189, 
  lng: -117.05553043117615
}

const options = {
  disableDefaultUI: true,
  gestureHandling: "greedy"
}

export const ContactMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAYe12_fPCYzLJawQNeabZORGYE5a5GnEU"
  })

  if(loadError) return "error loading";
  if(!isLoaded) return "loading...";

  return (
    <>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}options={options}>
        <InfoWindow position={{lat: 32.75471130774189, lng: -117.05553043117615}}>
          <div className="info-wrapper">
            <p className="info-label">Email us at</p>
            <p className="info-value">miriam@uweast.org</p>
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