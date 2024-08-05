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

  var clientKey = "YOUR-CLIENT-KEY";
  var theme = "DARK"; //available values: LIGHT, DARK, SYSTEM_DEFAULT
  IDWiseDynamic.initialize(clientKey, theme, error);

  var flowId = "FLOW-ID"; //aka journey definition id
  var referenceNo = "REFERENCE-NO";
  var locale = "en";
  IDWiseDynamic.startJourney(flowId, referenceNo, locale, journeyCallback);
}
