cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "idwise-cordova-sdk.IDWiseCordovaSDK",
      "file": "plugins/idwise-cordova-sdk/www/IDWiseCordovaSDK.js",
      "pluginId": "idwise-cordova-sdk",
      "clobbers": [
        "IDWise"
      ]
    }
  ];
  module.exports.metadata = {
    "idwise-cordova-sdk": "4.6.0"
  };
});