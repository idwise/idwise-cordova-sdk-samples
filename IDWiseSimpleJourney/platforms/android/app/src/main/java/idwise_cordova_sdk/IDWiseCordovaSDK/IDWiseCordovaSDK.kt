package idwise_cordova_sdk;

import android.util.Log
import com.idwise.sdk.IDWise
import com.idwise.sdk.IDWiseSDKCallback
import com.idwise.sdk.data.models.IDWiseSDKError
import com.idwise.sdk.data.models.IDWiseSDKTheme
import com.idwise.sdk.data.models.JourneyInfo
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject


/**
 * This class echoes a string called from JavaScript.
 */
class IDWiseCordovaSDK : CordovaPlugin() {
    @Throws(JSONException::class)
    override fun execute(
        action: String,
        args: JSONArray,
        callbackContext: CallbackContext
    ): Boolean {
        when (action) {
            "initialize" -> {
                val clientKey = args.getString(0)
                val theme = args.getString(1)

                val idwiseTheme: IDWiseSDKTheme = try {
                    IDWiseSDKTheme.valueOf(theme!!)
                } catch (e: Exception) {
                    IDWiseSDKTheme.SYSTEM_DEFAULT
                }

                clientKey?.let {
                    initialize(it, idwiseTheme, callbackContext)
                }
                return true
            }

            "startJourney" -> {
                val flowId = args.getString(0)
                val referenceNumber = args.getString(1)
                val locale = args.getString(2)
                startJourney(flowId, referenceNumber, locale, callbackContext)
                return true
            }
        }
        return false
    }

    private fun initialize(
        clientKey: String,
        theme: IDWiseSDKTheme,
        callbackContext: CallbackContext
    ) {

        IDWise.initialize(clientKey, theme) { error: IDWiseSDKError? ->
            val params = JSONObject()
            params.put("event", "onError")

            val data = JSONObject()
            data.put("errorCode", error!!.errorCode)
            data.put("message", error!!.message)
            params.put("data", data)

            val result = PluginResult(PluginResult.Status.ERROR, params)
            result.keepCallback = true
            callbackContext.sendPluginResult(result)
        }
    }

    private fun startJourney(
        flowId: String,
        referenceNumber: String,
        locale: String,
        callbackContext: CallbackContext
    ) {
        IDWise.startJourney(
            this.cordova.activity,
            flowId,
            referenceNumber,
            locale,
            object : IDWiseSDKCallback {
                override fun onJourneyStarted(journeyInfo: JourneyInfo) {
                    val params = JSONObject()
                    params.put("event", "onJourneyStarted")

                    val data = JSONObject()
                    data.put("journeyId", journeyInfo.journeyId)
                    params.put("data", data)

                    val result = PluginResult(PluginResult.Status.OK, params)
                    result.keepCallback = true

                    callbackContext.sendPluginResult(result)
                }

                override fun onJourneyResumed(journeyInfo: JourneyInfo) {
                    val params = JSONObject()
                    params.put("event", "onJourneyResumed")

                    val data = JSONObject()
                    data.put("journeyId", journeyInfo.journeyId)
                    params.put("data", data)

                    val result = PluginResult(PluginResult.Status.OK, params)
                    result.keepCallback = true

                    callbackContext.sendPluginResult(result)
                }

                override fun onJourneyCompleted(
                    journeyInfo: JourneyInfo,
                    isSucceeded: Boolean
                ) {
                    val params = JSONObject()
                    params.put("event", "onJourneyCompleted")

                    val data = JSONObject()
                    data.put("journeyId", journeyInfo.journeyId)
                    params.put("data", data)

                    val result = PluginResult(PluginResult.Status.OK, params)
                    result.keepCallback = false

                    callbackContext.sendPluginResult(result)
                }

                override fun onJourneyCancelled(journeyInfo: JourneyInfo?) {
                    val params = JSONObject()
                    params.put("event", "onJourneyCancelled")

                    val data = JSONObject()
                    data.put("journeyId", journeyInfo?.journeyId?:"")
                    params.put("data", data)

                    val result = PluginResult(PluginResult.Status.OK, params)
                    result.keepCallback = false

                    callbackContext.sendPluginResult(result)

                }

                override fun onError(error: IDWiseSDKError) {
                    val params = JSONObject()
                    params.put("event", "onError")

                    val data = JSONObject()
                    data.put("errorCode", error.errorCode)
                    data.put("message", error.message)
                    params.put("data", data)

                    val result = PluginResult(PluginResult.Status.ERROR, params)
                    result.keepCallback = true
                    callbackContext.sendPluginResult(result)
                }
            }
        )
    }
}