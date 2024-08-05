cordova.define("idwise-cordova-sdk.IDWiseCordovaSDK", function(require, exports, module) {
var exec = require("cordova/exec");

exports.initialize = function (clientKey, theme, error) {
  console.log("IDWISE.JS -> initialize");
  function success(result) {
    //dummy success required to pass to exec
  }
  function errorCb(ex) {
    error(JSON.parse(ex.data));
  }
  exec(success, errorCb, "IDWiseCordovaSDK", "initialize", [clientKey, theme]);
};

exports.startJourney = function (flowId, referenceNo, locale, applicantDetails, journeyCallback) {
  console.log("applicant details");
  console.log(applicantDetails);
  function success(result) {
    console.log(result);

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

      default:
        console.log("unknown event call", result.event);
    }
  }

  function error(error) {
    journeyCallback.onError(JSON.parse(error.data));
  }

  exec(success, error, "IDWiseCordovaSDK", "startJourney", [flowId, referenceNo, locale, applicantDetails]);
};

});
