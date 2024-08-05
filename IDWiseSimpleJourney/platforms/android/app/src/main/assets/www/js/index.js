document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

function initializeAndStartJourney() {
  function error(error) {
    console.log("Event onJourneyError received:", error.code, error.message);
  }

  const journeyCallback = {
    onJourneyStarted(journeyStartedInfo) {
      console.log(`Journey Started with id ${journeyStartedInfo.journeyId}`);
    },
    onJourneyResumed(journeyResumedInfo) {
      console.log(`Journey Resumed with id ${journeyResumedInfo.journeyId}`);
    },
    onJourneyCompleted(journeyCompletedInfo) {
      console.log(`Journey Fininshed with id ${journeyCompletedInfo.journeyId}`);
    },
    onJourneyCancelled(journeyCancelledInfo) {
      console.log(`Journey Cancelled with id ${journeyCancelledInfo.journeyId}`);
    },
    onError(error) {
      console.log("Event onJourneyError received:", error.code, error.message);
    },
  };

  var clientKey = "QmFzaWMgWkRJME1qVm1ZelV0WlRZeU1TMDBZV0kxTFdGak5EVXRObVZqT1RGaU9XSXpZakl6T21oUFlubE9VRXRpVVRkMWVubHBjbGhUYld4aU1GcDNOMWcyTkVwWWNrTXlOa1Z4U21oWlNsaz0=";
  var theme = "DARK"; //available values: LIGHT, DARK, SYSTEM_DEFAULT
  IDWiseDynamic.initialize(clientKey, theme, error);

  var flowId = "d2425fc5-e621-4ab5-ac45-6ec91b9b3b23"; //aka journey definition id
  var referenceNo = "REFERENCE-NO";
  var locale = "en";
  IDWiseDynamic.startJourney(flowId, referenceNo, locale, null, journeyCallback, journeyCallback);
}
