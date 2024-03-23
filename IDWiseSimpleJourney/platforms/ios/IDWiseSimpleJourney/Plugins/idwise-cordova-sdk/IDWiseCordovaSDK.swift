import IDWiseSDK

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
      // Deal with error here
      if let error = err {
        let arguments =
          [
            "event": "onError",
            "data": ["errorCode": error.code, "message": error.message] as [String: Any],
          ]
          as [String: Any]

        print(arguments)

        var pluginResult = CDVPluginResult(
          status: CDVCommandStatus_ERROR,
          messageAs: arguments
        )
        pluginResult?.keepCallback = true
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId)

      }
    }
  }

  @objc(startJourney:)
  func startJourney(_ command: CDVInvokedUrlCommand) {
    let flowId = command.arguments[0] as? String ?? ""
    let referenceNumber = command.arguments[1] as? String ?? ""
    let locale = command.arguments[2] as? String ?? ""

    self.journeyCallbackId = command.callbackId

    IDWise.startJourney(
      journeyDefinitionId: flowId, referenceNumber: referenceNumber,
      locale: locale, journeyDelegate: self)
  }
}

extension IDWiseCordovaSDK: IDWiseSDKJourneyDelegate {
  func onError(error: IDWiseSDKError) {
    let arguments =
      [
        "event": "onError",
        "data": ["errorCode": error.code, "message": error.message] as [String: Any],
      ]
      as [String: Any]
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_ERROR,
      messageAs: arguments
    )
    pluginResult?.keepCallback = true
    self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
  }

  func JourneyCancelled() {
    let arguments =
      ["event": "onJourneyCancelled", "data": ["journeyId": self.journeyID] as [String: Any]]
      as [String: Any]
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_OK,
      messageAs: arguments
    )
    pluginResult?.keepCallback = true
    self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
  }

  func JourneyStarted(journeyID: String) {
    self.journeyID = journeyID
    let arguments =
      ["event": "onJourneyStarted", "data": ["journeyId": journeyID] as [String: Any]]
      as [String: Any]
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_OK,
      messageAs: arguments
    )
    pluginResult?.keepCallback = true
    self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
  }

  func onJourneyResumed(journeyID: String) {
    self.journeyID = journeyID
    let arguments =
      ["event": "onJourneyResumed", "data": ["journeyId": journeyID] as [String: Any]]
      as [String: Any]
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_OK,
      messageAs: arguments
    )
    pluginResult?.keepCallback = true
    self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)

  }

  func JourneyFinished() {
    let arguments =
      ["event": "onJourneyCompleted", "data": ["journeyId": self.journeyID] as [String: Any]]
      as [String: Any]
    var pluginResult = CDVPluginResult(
      status: CDVCommandStatus_OK,
      messageAs: arguments
    )
    pluginResult?.keepCallback = true
    self.commandDelegate!.send(pluginResult, callbackId: self.journeyCallbackId)
  }
}
