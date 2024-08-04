cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-cszbar.zBar",
      "file": "plugins/cordova-plugin-cszbar/www/zbar.js",
      "pluginId": "cordova-plugin-cszbar",
      "clobbers": [
        "cloudSky.zBar"
      ]
    },
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
    "cordova-plugin-cszbar": "1.3.2",
    "idwise-cordova-sdk": "4.6.9"
  };
});