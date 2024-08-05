import IDWiseSDK
import Foundation

@objc(IDWiseCordovaSDK) class IDWiseCordovaSDK: CDVPlugin {
  // Member variables go here.

  var journeyCallbackId: String = ""
  var journeyID = ""

  @objc(initialize:)
  func initialize(_ command: CDVInvokedUrlCommand) {
    let clientKey = command.arguments[0] as? String ?? ""
    let theme = command.arguments[1] as? String ?? ""

    var sdkTheme: IDWiseSDKTheme = .systemDefault
    if theme == "LIGHT" {
      sdkTheme = .light
    } else if theme == "DARK" {
      sdkTheme = .dark
    }

    IDWise.initialize(clientKey: clientKey, theme: sdkTheme) { err in

      if let error = err {
        do {
          let jsonEncoder = JSONEncoder()
          let jsonData = try jsonEncoder.encode(error)
          let jsonResp = String(data: jsonData, encoding: String.Encoding.utf8)
          let arguments = ["event": "onError", "data": jsonResp] as [String: Any]

          print(arguments)

          var pluginResult = CDVPluginResult(
            status: CDVCommandStatus_ERROR,
            messageAs: arguments
          )
          pluginResult?.keepCallback = true
          self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
        } catch { print(error) }
      }
    }
  }

  @objc(startJourney:)
  func startJourney(_ command: CDVInvokedUrlCommand) {
    let flowId = command.arguments[0] as? String ?? ""
    let referenceNumber = command.arguments[1] as? String ?? ""
    let locale = command.arguments[2] as? String ?? ""
    let applicantDetails = command.arguments[3] as? String ?? ""

    self.journeyCallbackId = command.callbackId

    IDWise.startJourney(
      flowId: flowId, referenceNumber: referenceNumber,
      locale: locale, applicantDetails: nil, journeyDelegate: self)
  }

  @objc(startDynamicJourney:)
  func startDynamicJourney(_ command: CDVInvokedUrlCommand) {
    let flowId = command.arguments[0] as? String ?? ""
    let referenceNumber = command.arguments[1] as? String ?? ""
    let locale = command.arguments[2] as? String ?? ""
    let applicantDetails = command.arguments[3] as? String ?? ""

    self.journeyCallbackId = command.callbackId

    IDWiseDynamic.startJourney(
      flowId: flowId, referenceNumber: referenceNumber,
      locale: locale, applicantDetails: nil, journeyDelegate: self, stepDelegate: self)
  }

  @objc(resumeJourney:)
  func resumeJourney(_ command: CDVInvokedUrlCommand) {
    let flowId = command.arguments[0] as? String ?? ""
    let journeyId = command.arguments[1] as? String ?? ""
    let locale = command.arguments[2] as? String ?? ""

    self.journeyCallbackId = command.callbackId

    IDWise.resumeJourney(
      flowId: flowId, journeyId: journeyId,
      locale: locale, journeyDelegate: self)
  }

  @objc(resumeDynamicJourney:)
  func resumeDynamicJourney(_ command: CDVInvokedUrlCommand) {
    let flowId = command.arguments[0] as? String ?? ""
    let journeyId = command.arguments[1] as? String ?? ""
    let locale = command.arguments[2] as? String ?? ""

    self.journeyCallbackId = command.callbackId

    IDWiseDynamic.resumeJourney(
      flowId: flowId, journeyId: journeyId,
      locale: locale, journeyDelegate: self, stepDelegate: self)
  }

  @objc(getJourneySummary:)
  func getJourneySummary(_ command: CDVInvokedUrlCommand) {
    print("swift getjourneysummary")
    IDWiseDynamic.getJourneySummary(
      callback: { journeySummary, error in
        if let summary = journeySummary {
          print("swift getjourneysummary success")
          do {
              let jsonEncoder = JSONEncoder()
              let jsonData = try jsonEncoder.encode(summary)
              let json = String(data: jsonData, encoding: String.Encoding.utf8)
              let arguments = ["journeySummary": json] as [String: Any]
              var pluginResult = CDVPluginResult(
                status: CDVCommandStatus_OK,
                messageAs: arguments
              )
              pluginResult?.keepCallback = false
              self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
          } catch {
            print(error)
          }

        } else {
          if let err = error {
            do {
              let jsonEncoder = JSONEncoder()
              let jsonData = try jsonEncoder.encode(error)
              let jsonResp = String(data: jsonData, encoding: String.Encoding.utf8)
              let arguments = ["error": jsonResp] as [String: Any]
              var pluginResult = CDVPluginResult(
                status: CDVCommandStatus_ERROR,
                messageAs: arguments
              )
              pluginResult?.keepCallback = false
              self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)
            } catch { print(error) }
          }
        }

      })
  }

  @objc(startStep:)
  func startStep(_ command: CDVInvokedUrlCommand) {
    let stepId = command.arguments[0] as? String ?? ""
    IDWiseDynamic.startStep(stepId: stepId)
  }

  @objc(skipStep:)
  func skipStep(_ command: CDVInvokedUrlCommand) {
    let stepId = command.arguments[0] as? String ?? ""
    IDWiseDynamic.skipStep(stepId: stepId)
  }

  @objc(unloadSDK:)
  func unloadSDK(_ command: CDVInvokedUrlCommand) {
    IDWiseDynamic.unloadSDK()
  }

  @objc(finishJourney:)
  func finishJourney(_ command: CDVInvokedUrlCommand) {
    IDWiseDynamic.finishJourney()
  }
}

extension IDWiseCordovaSDK: IDWiseSDKJourneyDelegate {
  func onError(error: IDWiseSDKError) {
    do {
      let jsonEncoder = JSONEncoder()
      let jsonData = try jsonEncoder.encode(error)
      let jsonResp = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onError", "data": jsonResp] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_ERROR,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch { print(error) }
  }

  func onJourneyCancelled(journeyCancelledInfo: JourneyCancelledInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(journeyCancelledInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onJourneyCancelled", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }

  func onJourneyStarted(journeyStartedInfo: JourneyStartedInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(journeyStartedInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onJourneyStarted", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }

  func onJourneyResumed(journeyResumedInfo: JourneyResumedInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(journeyResumedInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onJourneyResumed", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }

  }

  func onJourneyCompleted(journeyCompletedInfo: JourneyCompletedInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(journeyCompletedInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onJourneyCompleted", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }
}

extension IDWiseCordovaSDK: IDWiseSDKStepDelegate {
  func onStepSkipped(stepSkippedInfo: StepSkippedInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(stepSkippedInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onStepSkipped", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }

  func onStepCancelled(stepCancelledInfo: StepCancelledInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(stepCancelledInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onStepCancelled", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }

  // Handling UI on each step capture and completion
  func onStepResult(stepResultInfo: StepResultInfo) {

    let jsonEncoder = JSONEncoder()
    do {
      let jsonData = try jsonEncoder.encode(stepResultInfo)
      let json = String(data: jsonData, encoding: String.Encoding.utf8)
      let arguments = ["event": "onStepResult", "data": json] as [String: Any]
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }

  func onStepCaptured(stepCapturedInfo: StepCapturedInfo) {

    do {
      let originalImage = convertImageToBase64String(img: stepCapturedInfo.originalImage)
      let croppedImage = convertImageToBase64String(img: stepCapturedInfo.croppedImage)
      
      let arguments = ["event": "onStepCaptured", "data": "{\"stepId\":\"\(stepCapturedInfo.stepId)\", \"originalImage\":\"\(originalImage)\", \"croppedImage\":\"\(croppedImage)\"}"] as [String: Any]
      
      var pluginResult = CDVPluginResult(
        status: CDVCommandStatus_OK,
        messageAs: arguments
      )
      pluginResult?.keepCallback = true
      self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
    } catch {
      print(error)
    }
  }


  func convertImageToBase64String(img: UIImage?) -> String {
    return img?.jpegData(compressionQuality: 1)?.base64EncodedString() ?? ""
  }
}
