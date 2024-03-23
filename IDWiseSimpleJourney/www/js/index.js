document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

function initializeAndStartJourney() {
  function error(error) {
    console.log(
      "Event onJourneyError received:",
      error.errorCode,
      error.message
    );
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

  var clientKey = "YOUR-CLIENT-KEY";
  var theme = "DARK"; //available values: LIGHT, DARK, SYSTEM_DEFAULT
  IDWise.initialize(clientKey, theme, error);

  var flowId = "FLOW-ID"; //aka journey definition id
  var referenceNo = "REFERENCE-NO";
  var locale = "en";
  IDWise.startJourney(flowId, referenceNo, locale, journeyCallback);
}
