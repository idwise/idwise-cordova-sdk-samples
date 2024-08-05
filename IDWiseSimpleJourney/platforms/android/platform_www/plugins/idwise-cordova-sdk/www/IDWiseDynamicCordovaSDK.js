cordova.define("idwise-cordova-sdk.IDWiseCordovaDynamicSDK", function(require, exports, module) {
var exec = require("cordova/exec");

exports.initialize = function (clientKey, theme, initializeError) {
  console.log("IDWISE-Dynamic.JS -> initialize");
  function success(result) {
    //dummy success required to pass to exec
  }
  function errorCb(ex) {
    console.log("IDWISE-Dynamic.JS -> errorCb");
    console.log(ex);
    initializeError(JSON.parse(ex.data));
  }
  exec(success, errorCb, "IDWiseCordovaSDK", "initialize", [clientKey, theme]);
};

exports.startJourney = function (flowId, referenceNo, locale, applicantDetails, journeyCallback, stepCallback) {
  console.log("IDWISE-Dynamic.JS -> startJourney");
  function success(result) {
    triggerCallbacks(result, journeyCallback, stepCallback);
  }

  function error(error) {
    console.log("onError ", error.data);
    journeyCallback.onError(error.data);
  }

  exec(success, error, "IDWiseCordovaSDK", "startDynamicJourney", [flowId, referenceNo, locale, applicantDetails]);
};

exports.resumeJourney = function (flowId, journeyId, locale, journeyCallback, stepCallback) {
  console.log("IDWISE-Dynamic.JS -> resumeJourney");
  function success(result) {
    triggerCallbacks(result, journeyCallback, stepCallback);
  }

  function error(error) {
    console.log("onError ", error.data);
    journeyCallback.onError(error.data);
  }

  exec(success, error, "IDWiseCordovaSDK", "resumeDynamicJourney", [flowId, journeyId, locale]);
};

exports.startStep = function (stepId) {
  console.log("IDWISE-Dynamic.JS -> startStep", stepId);
  function success(result) {}
  function error(ex) {
    console.log("IDWISE-Dynamic.JS -> errorCb", ex);
  }

  exec(success, error, "IDWiseCordovaSDK", "startStep", [stepId]);
};

exports.skipStep = function (stepId) {
  console.log("IDWISE-Dynamic.JS -> skipStep", stepId);
  function success(result) {}
  function error(ex) {
    console.log("IDWISE-Dynamic.JS -> errorCb", ex);
  }

  exec(success, error, "IDWiseCordovaSDK", "skipStep", [stepId]);
};

exports.unloadSKD = function () {
  console.log("IDWISE-Dynamic.JS -> unloadSKD");
  function success(result) {}
  function error(ex) {
    console.log("IDWISE-Dynamic.JS -> errorCb", ex);
  }

  exec(success, error, "IDWiseCordovaSDK", "unloadSKD", []);
};

exports.finishJourney = function () {
  console.log("IDWISE-Dynamic.JS -> finishJourney");
  function success(result) {}
  function error(ex) {
    console.log("IDWISE-Dynamic.JS -> errorCb", ex);
  }

  exec(success, error, "IDWiseCordovaSDK", "finishJourney", []);
};

exports.getJourneySummary = function (success, error) {
  console.log("IDWISE-Dynamic.JS -> getJourneySummary");

  function onSuccess(response) {
    success(JSON.parse(response.journeySummary));
  }

  function onError(errorResponse) {
    console.log(`getjourneysummary error ${JSON.stringify(errorResponse)}`);
    error(JSON.parse(errorResponse.error));
  }

  exec(onSuccess, onError, "IDWiseCordovaSDK", "getJourneySummary", []);
};

function triggerCallbacks(result, journeyCallback, stepCallback) {
  switch (result.event) {
    case "onJourneyStarted":
      journeyCallback.onJourneyStarted(JSON.parse(result.data));
      break;
    case "onJourneyResumed":
      journeyCallback.onJourneyResumed(JSON.parse(result.data));
      break;
    case "onJourneyCompleted":
      journeyCallback.onJourneyCompleted(JSON.parse(result.data));
      break;
    case "onJourneyCancelled":
      journeyCallback.onJourneyCancelled(JSON.parse(result.data));
      break;

    case "onStepCaptured":
      stepCallback.onStepCaptured(JSON.parse(result.data));
      break;
    case "onStepResult":
      stepCallback.onStepResult(JSON.parse(result.data));
      break;
    case "onStepCancelled":
      stepCallback.onStepCancelled(JSON.parse(result.data));
      break;
    case "onStepSkipped":
      stepCallback.onStepSkipped(JSON.parse(result.data));
      break;

    default:
      console.log("unknown event call", result.event);
  }
}

});
