cordova.define("idwise-cordova-sdk.IDWiseCordovaSDK", function(require, exports, module) {
var exec = require('cordova/exec');

exports.initialize = function (clientKey,theme, error) {
    console.log("IDWISE.JS -> initialize");
    function success(result){
        //dummy success required to pass to exec
    }
    function errorCb(ex){
        error(ex.data);
    }
    exec(success, errorCb, 'IDWiseCordovaSDK', 'initialize', [clientKey, theme]);
};


exports.startJourney = function (flowId, referenceNo, locale, journeyCallback) {
    
    function success(result){
        switch(result.event) {
            case "onJourneyStarted":
                journeyCallback.onJourneyStarted(result.data);
              break;
            case "onJourneyResumed":
                journeyCallback.onJourneyResumed(result.data);
              break;
            case "onJourneyCompleted":
                journeyCallback.onJourneyCompleted(result.data);
            break;
            case "onJourneyCancelled":
                journeyCallback.onJourneyCancelled(result.data);
            break;

            default:
              console.log("unknown event call", result.event);
          }
    }

    function error(error){
        journeyCallback.onError(error.data);
    }
    
    exec(success, error, 'IDWiseCordovaSDK', 'startJourney', [flowId, referenceNo, locale]);
};
});
