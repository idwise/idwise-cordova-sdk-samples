package idwise_cordova_sdk;

import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.idwise.sdk.IDWise
import com.idwise.sdk.IDWiseDynamic
import com.idwise.sdk.IDWiseSDKJourneyCallback
import com.idwise.sdk.IDWiseSDKStepCallback
import com.idwise.sdk.data.models.*
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import android.graphics.Bitmap
import android.util.Base64

/**
 * This class echoes a string called from JavaScript.
 */
class IDWiseCordovaSDK : CordovaPlugin() {


    val gson = Gson()
    lateinit var journeyCallbackContext: CallbackContext

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
                val applicantDetails = args.getString(3)
                startJourney(flowId, referenceNumber, locale, applicantDetails, callbackContext)
                return true
            }

            "startDynamicJourney" -> {
                val flowId = args.getString(0)
                val referenceNumber = args.getString(1)
                val locale = args.getString(2)
                val applicantDetails = args.getString(3)
                startDynamicJourney(flowId, referenceNumber, locale, applicantDetails, callbackContext)
                return true
            }

            "resumeJourney" -> {
                val flowId = args.getString(0)
                val journeyId = args.getString(1)
                val locale = args.getString(2)

                resumeJourney(flowId, journeyId, locale, callbackContext)
                return true
            }


            "resumeDynamicJourney" -> {
                val flowId = args.getString(0)
                val journeyId = args.getString(1)
                val locale = args.getString(2)
                
                resumeDynamicJourney(flowId, journeyId, locale, callbackContext)
                return true
            }

            "getJourneySummary" -> {
                getJourneySummary(callbackContext)
                return true
            }

            "startStep" -> {
                val stepId = args.getString(0)
                startStep(stepId)
                return true
            }

            "skipStep" -> {
                val stepId = args.getString(0)
                skipStep(stepId)
                return true
            }

            "unloadSDK" -> {
                unloadSDK()
                return true
            }

            "finishJourney" -> {
                finishJourney()
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

            params.put("data", gson.toJson(error!!))

            val result = PluginResult(PluginResult.Status.ERROR, params)
            result.keepCallback = true
            callbackContext.sendPluginResult(result)
        }
    }


    private fun startJourney(
        flowId: String,
        referenceNumber: String,
        locale: String,
        applicantDetails: String?,
        callbackContext: CallbackContext
    ) {
        journeyCallbackContext = callbackContext

        val applicantDetailsObject: HashMap<String, String>? =
            if (applicantDetails == null || applicantDetails == "null") null else Gson().fromJson(
                gson.toJson(applicantDetails), object : TypeToken<HashMap<String, String>>() {}.type
            )

        IDWise.startJourney(
            this.cordova.activity,
            flowId,
            referenceNumber,
            locale,
            applicantDetailsObject,
            journeyCallbacks
        )
    }

    fun resumeJourney(
        flowId: String,
        journeyId: String,
        locale: String? = null,
        callbackContext: CallbackContext
    ) {
        journeyCallbackContext = callbackContext
        IDWise.resumeJourney(this.cordova.activity, flowId, journeyId, locale, journeyCallbacks)
    }

    fun resumeDynamicJourney(
        flowId: String,
        journeyId: String,
        locale: String? = null,
        callbackContext: CallbackContext
    ) {
        journeyCallbackContext = callbackContext
        IDWiseDynamic.resumeJourney(
            this.cordova.activity,
            flowId,
            journeyId,
            locale,
            journeyCallbacks,
            stepCallbacks
        )
    }


    private fun startDynamicJourney(
        flowId: String,
        referenceNumber: String,
        locale: String,
        applicantDetails: String?,
        callbackContext: CallbackContext
    ) {
        journeyCallbackContext = callbackContext

        val applicantDetailsObject: HashMap<String, String>? =
            if (applicantDetails == null || applicantDetails == "null") null else Gson().fromJson(
                gson.toJson(applicantDetails), object : TypeToken<HashMap<String, String>>() {}.type
            )
        
        IDWiseDynamic.startJourney(
            this.cordova.activity,
            flowId,
            referenceNumber,
            locale,
            applicantDetailsObject,
            journeyCallbacks,
            stepCallbacks
        )
    }

    private fun startStep(stepId: String) {
        IDWiseDynamic.startStep(
            this.cordova.activity,
            stepId
        )
    }

    private fun skipStep(stepId: String) {
        IDWiseDynamic.skipStep(stepId)
    }

    private fun unloadSDK() {
        IDWiseDynamic.unloadSDK()
    }

    private fun finishJourney() {
        IDWiseDynamic.finishJourney()
    }

    private fun getJourneySummary(callbackContext: CallbackContext){
          IDWiseDynamic.getJourneySummary { journeySummary, error ->
            if (journeySummary != null) {
                val params = JSONObject()
                params.put("journeySummary", gson.toJson(journeySummary))
                val result = PluginResult(PluginResult.Status.OK, params)
                result.keepCallback = false
                callbackContext.sendPluginResult(result)
            } else if(error != null){
                 val params = JSONObject()
                 params.put("error", gson.toJson(error!!))
                val result = PluginResult(PluginResult.Status.ERROR, params)
                result.keepCallback = false
                callbackContext.sendPluginResult(result)
            }
        }
    }

    private val journeyCallbacks = object : IDWiseSDKJourneyCallback {
        override fun onJourneyStarted(journeyInfo: JourneyStartedInfo) {
            val params = JSONObject()
            params.put("event", "onJourneyStarted")

            params.put("data", gson.toJson(journeyInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onJourneyResumed(journeyInfo: JourneyResumedInfo) {
            val params = JSONObject()
            params.put("event", "onJourneyResumed")
            params.put("data", gson.toJson(journeyInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onJourneyCompleted(
            journeyInfo: JourneyCompletedInfo
        ) {
            val params = JSONObject()
            params.put("event", "onJourneyCompleted")

            params.put("data", gson.toJson(journeyInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = false

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onJourneyCancelled(journeyInfo: JourneyCancelledInfo) {
            val params = JSONObject()
            params.put("event", "onJourneyCancelled")

            params.put("data", gson.toJson(journeyInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = false

            journeyCallbackContext.sendPluginResult(result)

        }

        override fun onError(error: IDWiseSDKError) {
            val params = JSONObject()
            params.put("event", "onError")
            params.put("data", gson.toJson(error))

            val result = PluginResult(PluginResult.Status.ERROR, params)
            result.keepCallback = true
            journeyCallbackContext.sendPluginResult(result)
        }
    }

    private val stepCallbacks = object : IDWiseSDKStepCallback {
        override fun onStepCaptured(stepCapturedInfo: StepCapturedInfo) {
            Log.d("stepCallbacks", "onStepCaptured ${stepCapturedInfo.stepId}")
            val params = JSONObject()
            params.put("event", "onStepCaptured")
            
            val originalImage = convertImageToBase64String(stepCapturedInfo.originalImage)
            val croppedImage = convertImageToBase64String(stepCapturedInfo.croppedImage)
            
            val resp = JSONObject()
            resp.put("stepId", stepCapturedInfo.stepId)
            resp.put("croppedImage",croppedImage)
            resp.put("originalImage", originalImage)

            params.put("data", gson.toJson(resp))

            Log.d("stepCallbacks", "onStepCaptured ${params}")
            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onStepResult(stepResultInfo: StepResultInfo) {
            Log.d("stepCallbacks", "onStepResult ${stepResultInfo.stepId}")
            val params = JSONObject()
            params.put("event", "onStepResult")
            params.put("data",gson.toJson(stepResultInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onStepCancelled(stepCancelledInfo: StepCancelledInfo) {
            Log.d("stepCallbacks", "onStepCancelled Step ${stepCancelledInfo.stepId} cancelled!!")
            val params = JSONObject()
            params.put("event", "onStepCancelled")
            params.put("data", gson.toJson(stepCancelledInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

        override fun onStepSkipped(stepSkippedInfo: StepSkippedInfo) {
            Log.d("stepCallbacks", "onStepSkipped Step ${stepSkippedInfo.stepId} skipped!!")
            val params = JSONObject()
            params.put("event", "onStepSkipped")
            params.put("data", gson.toJson(stepSkippedInfo))

            val result = PluginResult(PluginResult.Status.OK, params)
            result.keepCallback = true

            journeyCallbackContext.sendPluginResult(result)
        }

    }

    fun convertImageToBase64String(bitmap: Bitmap?): String {
        if (bitmap == null || bitmap.isRecycled) return ""

        val baos = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos)
        val b = baos.toByteArray()
        return Base64.encodeToString(b, Base64.DEFAULT)
  }

}