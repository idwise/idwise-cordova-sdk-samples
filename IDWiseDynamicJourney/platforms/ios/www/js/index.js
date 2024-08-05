document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

function initializeAndStartJourney() {
  function error(error) {
    console.log(`Error in initialize ${error.errorCode} : ${error.errorMessage}`);
    alert(error.message);
  }

  const journeyCallback = {
    onJourneyStarted(journeyStartedInfo) {
      console.error(`onJourneyStarted ${journeyStartedInfo.journeyId}`);
      alert(`Journey Started ${journeyStartedInfo.journeyId}`);
    },
    onJourneyResumed(journeyResumedInfo) {
      alert(`onJourneyResumed ${journeyResumedInfo.journeyId}`);
      console.log(`Journey Resumed ${journeyResumedInfo.journeyId}`);
    },
    onJourneyCompleted(journeyCompletedInfo) {
      alert(`onJourneyCompleted ${journeyCompletedInfo.journeyId}`);
      console.log(`onJourneyCompleted ${journeyCompletedInfo.journeyId}`);
    },
    onJourneyCancelled(journeyCancelledInfo) {
      alert(`onJourneyCancelled ${journeyCancelledInfo.journeyId}`);
      console.log(`onJourneyCancelled ${journeyCancelledInfo.journeyId}`);
    },
    onError(error) {
      console.log("Event onJourneyError received:", error.errorCode, error.message);
      alert(error.message);
    },
  };

  const stepCallback = {
    onStepCaptured(stepCapturedInfo) {
      alert(`onStepCaptured ${JSON.stringify(stepCapturedInfo)}`);
      console.log(`onStepCaptured ${stepCapturedInfo.stepId}`);
    },
    onStepResult(stepResultInfo) {
      alert(`onStepResult ${stepResultInfo.stepId}: ${JSON.stringify(stepResultInfo.stepResult)}`);
      console.log(`onStepResult ${stepResultInfo.stepId}: ${JSON.stringify(stepResultInfo.stepResult)}`);
    },
    onStepCancelled(stepCancelledInfo) {
      alert(`onStepCancelled ${stepCancelledInfo.stepId}`);
      console.log(`onStepCancelled ${stepCancelledInfo.stepId}`);
    },
    onStepSkipped(stepSkippedInfo) {
      alert(`onStepSkipped ${stepSkippedInfo.stepId}`);
      console.log(`onStepSkipped ${stepSkippedInfo.stepId}`);
    },
  };

  //setTimeout(() => {
  var clientKey = "CLIENT-KEY-HERE";
  var theme = "DARK"; //available values: LIGHT, DARK, SYSTEM_DEFAULT
  IDWiseDynamic.initialize(clientKey, theme, error);

  var flowId = "FLOW-ID-HERE"; //aka journey definition id
  var referenceNo = "idw-test-33";
  var locale = "en";
  IDWiseDynamic.startJourney(flowId, referenceNo, locale, null, journeyCallback, stepCallback);
  //}, 500);
}

function getJourneySummary() {
  function success(journeySummary) {
    console.log(`journeysummary ${JSON.stringify(journeySummary)}`);
    alert(`getJourneySummary ${JSON.stringify(journeySummary)}`);
  }
  function error(error) {
    alert(`getJourneySummary error ${JSON.stringify(error)}`);
  }
  IDWiseDynamic.getJourneySummary(success, error);
}

function startStep(stepId) {
  IDWiseDynamic.startStep(stepId);
}

function skipStep(stepId) {
  IDWiseDynamic.skipStep(stepId);
}

function finishJourney() {
  IDWiseDynamic.finishJourney();
}

function unloadSKD() {
  IDWiseDynamic.unloadSKD();
}
