document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

function initializeAndStartJourney() {
  function error(error) {
    alert(error.message);
  }

  const journeyCallback = {
    onJourneyStarted(journeyInfo) {
      console.log(`Journey Started with id ${journeyInfo.journeyId}`);
    },
    onJourneyResumed(journeyInfo) {
      console.log(`Journey Resumed with id ${journeyInfo.journeyId}`);
    },
    onJourneyCompleted(journeyInfo) {
      console.log(`Journey Fininshed with id ${journeyInfo.journeyId}`);
    },
    onJourneyCancelled(journeyInfo) {
      console.log(`Journey Cancelled with id ${journeyInfo.journeyId}`);
    },
    onError(error) {
      console.log(
        "Event onJourneyError received:",
        error.errorCode,
        error.message
      );
    },
  };

  //setTimeout(() => {
  var clientKey =
    "QmFzaWMgWkRJME1qVm1ZelV0WlRZeU1TMDBZV0kxTFdGak5EVXRObVZqT1RGaU9XSXpZakl6T21oUFlubE9VRXRpVVRkMWVubHBjbGhUYld4aU1GcDNOMWcyTkVwWWNrTXlOa1Z4U21oWlNsaz0=";
  var theme = "DARK"; //available values: LIGHT, DARK, SYSTEM_DEFAULT
  IDWise.initialize(clientKey, theme, error);

  var flowId = "d2425fc5-e621-4ab5-ac45-6ec91b9b3b23"; //aka journey definition id
  var referenceNo = "idw-test-1";
  var locale = "en";
  IDWise.startJourney(flowId, referenceNo, locale, journeyCallback);
  //}, 500);
}
