import React from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  infoWindow
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%"
}

const center = {
  lat: 32.75471130774189, 
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
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}options={options}></GoogleMap>
  )
}

export default ContactMap;