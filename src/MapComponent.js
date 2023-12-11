/* MapComponent.js
   getting this to work was a real challenge. 
   after question five, question 6 appears and is undefined. 
   i'm not sure how to fix it.

   there are probably many better ways to implement the features
   listed on the spec, but this is what i came up with.
*/ 

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Rectangle,
} from "@react-google-maps/api";

// component that renders a rectangle using the react-google-maps api wrapper
const MapRectangle = ({ bounds, color, opacity }) => {
  return (
    <Rectangle
      bounds={bounds}
      options={{
        fillColor: color,
        fillOpacity: opacity,
        strokeWeight: 0,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
      }}
    />
  );
};

// main part of the component
const MapComponent = () => {
  const [clickedLocation, setClickedLocation] = useState(null);

  // needed to store building locations in the state
  const [buildings] = useState([
    {
      id: 1,
      name: "Experimental Theater",
      lat: 34.236521353497395,
      lng: -118.52771475791933,
    },
    {
      id: 2,
      name: "Campus Store Complex",
      lat: 34.237523631105084,
      lng: -118.52811809509994,
    },
    {
      id: 3,
      name: "Cypress Hall",
      lat: 34.23641491623646,
      lng: -118.5296952340007,
    },
    {
      id: 4,
      name: "Manzanita Hall",
      lat: 34.23773650268907,
      lng: -118.5296952340007,
    },
    {
      id: 5,
      name: "Chaparral Hall",
      lat: 34.238277548875814,
      lng: -118.52700229614975,
    },
  ]);

  // storing the quiz questions in the state
  const [questions] = useState([
    "Where is the Experimental Theater?",
    "Where is the Campus Store Complex?",
    "Where is Cypress Hall?",
    "Where is Manzanita Hall?",
    "Where is Chaparral Hall?",
  ]);

  // correct buildings for each question
  const [correctAnswers] = useState([0, 1, 2, 3, 4]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [userPoints, setUserPoints] = useState(0);

  // lat and long coords for rectangles (there might be a better way to do this)
  const rectangleBoundsOne = {
    north: 34.236649133468866, // Upper latitude
    south: 34.23640964980598, // Lower latitude
    east: -118.52754309654237, // Right longitude
    west: -118.5279615211487, // Left longitude
  };
  const rectangleBoundsTwo = {
    north: 34.237757845253114, // Upper latitude
    south: 34.237154707853435, // Lower latitude
    east: -118.52770402908327, // Right longitude
    west: -118.52863743782045, // Left longitude
  };
  const rectangleBoundsThree = {
    north: 34.23668461247209, // Upper latitude
    south: 34.236054857942186, // Lower latitude
    east: -118.52928116798402, // Right longitude
    west: -118.53005364418031, // Left longitude
  };
  const rectangleBoundsFour = {
    north: 34.237811063051495, // Upper latitude
    south: 34.23758932200288, // Lower latitude
    east: -118.52957084655763, // Right longitude
    west: -118.530536441803, // Left longitude
  };
  const rectangleBoundsFive = {
    north: 34.23852950003741, // Upper latitude
    south: 34.23792636816597, // Lower latitude
    east: -118.52671697616579, // Right longitude
    west: -118.52721050262453, // Left longitude
  };


  // big useEffect for updating the state with the user's clicked location
  useEffect(() => {
    if (clickedLocation && currentQuestionIndex < questions.length) {
      const clickedBuilding = buildings.find((building) =>
        isWithinRadius(clickedLocation, building, 0.000485)
      );
      console.log("click build:", clickedLocation);
      const isCorrectAnswer = clickedBuilding !== undefined;
      setFeedbackMessage(isCorrectAnswer ? "Correct!" : "Incorrect!");
      setUserPoints((prevPoints) =>
        isCorrectAnswer ? prevPoints + 1 : prevPoints
      );
      // after two seconds, set the clicked location to null, reset feedback message, and proceed to next question
      setTimeout(() => {
        setClickedLocation(null);
        setFeedbackMessage("");
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }, 2000);

      // check to see if the index is equal to the amount of questions
    } else if (currentQuestionIndex === questions.length) {
      console.log("quiz finished");
    }
  }, [
    clickedLocation,
    buildings,
    correctAnswers,
    currentQuestionIndex,
    questions.length,
  ]);

  const handleMapClick = (event) => {
    // get the clicked coordinates
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    // store the clicked location in state
    setClickedLocation({ lat: clickedLat, lng: clickedLng });
  };

  // modified this from stack overflow - https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
  const isWithinRadius = (clickedLocation, building, radius) => {
    // calculate the distance between two points using the Haversine formula
    const latDiff = clickedLocation.lat - building.lat;
    const lngDiff = clickedLocation.lng - building.lng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    return distance < radius;
  };

  const mapContainerStyle = {
    width: "800px",
    height: "700px",
  };

  const center = {
    lat: 34.2383, 
    lng: -118.53, 
  };

  // map options to be used in the google maps api wrapper
  const mapOptions = {
    gestureHandling: "none", 
    zoomControl: false, 
    streetViewControl: false, 
    mapTypeControl: false, 
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // switch statement to return rectangle boudns to the rectangle wrapper
  const getRectangleBounds = (index) => {
    switch (index) {
      case 0:
        console.log("Bounds for Rectangle 1:", rectangleBoundsOne);
        return rectangleBoundsOne;
      case 1:
        console.log("Bounds for Rectangle 2:", rectangleBoundsTwo);
        return rectangleBoundsTwo;
      case 2:
        console.log("Bounds for Rectangle 3:", rectangleBoundsThree);
        return rectangleBoundsThree;
      case 3:
        console.log("Bounds for Rectangle 4:", rectangleBoundsFour);
        return rectangleBoundsFour;
      case 4:
        console.log("Bounds for Rectangle 5:", rectangleBoundsFive);
        return rectangleBoundsFive;
      default:
        console.log("No bounds for Rectangle");
        return {}; 
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_API_KEY}>
        {/* display the questions */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "20px" }}>
          <p>{`${currentQuestionIndex + 1}. ${
            questions[currentQuestionIndex]
          }`}</p>
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p>{`Points: ${userPoints}`}</p>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={17}
          options={mapOptions}
          onClick={handleMapClick}
        >
            {/* map over the answers to display a rectangle after each question is answered */}
          {correctAnswers.map(
            (index, i) =>
              currentQuestionIndex > i && (
                <MapRectangle
                  key={i}
                  bounds={getRectangleBounds(index)}
                  color={userPoints > i ? "green" : "red"}
                  opacity={0.5}
                />
              )
          )}
          {buildings.map((building) => (
            <Marker
              key={building.id}
              position={{ lat: building.lat, lng: building.lng }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
