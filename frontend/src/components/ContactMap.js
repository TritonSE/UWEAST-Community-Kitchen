import React, {useState, useEffect} from 'react';
import {
  GoogleMap,
  useLoadScript,
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

const ContactMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAYe12_fPCYzLJawQNeabZORGYE5a5GnEU"
  })

  const [contactEmail, setContactEmail] = useState("none"); 

  useEffect(() => {
    fetch("http://localhost:9000/email/all")
    .then(async result => {
      if (result.ok) {
        const json = await result.json();

        if(json.emails !== undefined) {
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