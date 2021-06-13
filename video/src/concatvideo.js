import rainbowSDK from '../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js';

import css from "./videostyles.css";

angular.module("abs.teleconsultation.video", [
	'sdk',
	'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('DoctorVideo', {
      url: '/videodoc/',
      templateUrl: '../video/src/views/videoview.html',
      controller: 'ExavideoController'
    })
	.state('DoctorChat', {
      url: '/chatdoc/',
      templateUrl: '../chat/src/views/chatview.html',
      controller: 'exachatController'
    });
});

angular.module('abs').requires.push('abs.teleconsultation.video');

angular.module('abs').controller("ExavideoController",['rainbowSDK',
	'$rootScope', function ($rootScope,rainbowSDK) {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/

    console.log("[Exadoctor] :: Teleconsultation Application");

    var appId = "16a2cce0ac1911ebbe33e9ed28980ec8";
    var appSecret = "ZphIJDzvCMURdQ61FssxmwpcMbougDmEpZwYuNRM1sro6hSkc861Vt3J8CDRyPUs"; 

    var ctrl = this;
	
    var onReady = function onReady() {
      console.log("[Exadoctor] :: Exadoctor SDK is ready!");
    };

	sdk
			.initialize(appId,appSecret)
			.then(function () {
				console.log("[Exadoctor] :: Exadoctor SDK is initialized!");
			})
		.catch(function () {
			console.log("[Exadoctor] :: Something went wrong with the SDK...");
		});

	this.initialize = function () {
      console.log("DEMO :: Rainbow Demo Application");

      document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
    };

    this.initialize();
    return true;
	}	
	]);

angular.module('abs.teleconsultation.video').component('rbxConnection', {
  bindings: {
    name: '@',
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;
	$scope.isloginPlaying=false;
	$scope.loginplaying="";
    $scope.isLoading = false;

    $scope.state = rainbowSDK.connection.getState();

    $scope.hosts = [
      {
        id: 0,
        value: 'sandbox',
        name: 'Rainbow Sandbox',
      },
      {
        id: 1,
        value: 'rainbow',
        name: 'Rainbow Official',
      },
    ];

    $scope.selectedItem = $scope.hosts[0];

    var handlers = [];

    $scope.signin = function () {
      $scope.isLoading = true;

      saveToStorage();

      switch ($scope.selectedItem.value) {
        case 'rainbow':
          rainbowSDK.connection
            .signinOnRainbowOfficial($scope.user.name, $scope.user.password)
            .then(function (account) {
              console.log('[DEMO] :: Successfully signed!');
              $scope.isLoading = false;
              $scope.isConnected = true;
              $scope.$apply();
            })
            .catch(function (err) {
              console.log('[DEMO] :: Error when sign-in', err);
              $scope.isLoading = false;
              $scope.isConnected = false;
              $scope.$apply();
            });
          break;
        default:
          rainbowSDK.connection
            .signin($scope.user.name, $scope.user.password)
            .then(function (account) {
              console.log('[DEMO] :: Successfully signed!');
              $scope.$apply(function () {
                $scope.isLoading = false;
                $scope.isConnected = true;
			  $scope.isloginPlaying=true;
			  $scope.loginplaying="test";
                $scope.$apply();
              });
            })
            .catch(function (err) {
              console.log('[DEMO] :: Error when sign-in', err);
              $scope.isLoading = false;
              $scope.isConnected = false;
			  $scope.isloginPlaying=false;
			  $scope.loginplaying="";
              $scope.$apply();
            });
          break;
      }
    };

    $scope.signout = function () {
      $scope.isLoading = true;
      rainbowSDK.connection.signout().then(function () {
        $scope.isLoading = false;
        $scope.isConnected = false;
      });
    };

    var saveToStorage = function () {
      sessionStorage.connection = angular.toJson($scope.user);
      sessionStorage.host = angular.toJson($scope.selectedItem);
    };

    var readFromStorage = function () {
      if (sessionStorage.connection) {
        $scope.user = angular.fromJson(sessionStorage.connection);
      } else {
        $scope.user = {name: '', password: ''};
      }

      if (sessionStorage.host) {
        $scope.selectedItem =
          $scope.hosts[angular.fromJson(sessionStorage.host).id];
      } else {
        $scope.selectedItem = $scope.hosts[0];
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event,
    ) {
      $scope.state = rainbowSDK.connection.getState();
      $scope.$apply();
    };

    this.$onInit = function () {
      // Subscribe to XMPP connection change
      handlers.push();
    };

    this.$onDestroy = function () {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };

    var initialize = function () {
      readFromStorage();
      document.addEventListener(
        rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
        onConnectionStateChangeEvent,
      );
    };

    initialize();
  },
  templateUrl: '../video/src/js/components/connection/connectionCmp.template.html',
});


angular.module("abs.teleconsultation.video").component("rbxContact", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    "use strict";

    var listeners = [];

    $scope.contacts = [
      {
        _displayName: "No recipient",
        id: "no",
        status: "offline",
        avatar: { src: null },
      },
    ];

    $scope.selectedItem = null;

    $scope.actionAudio = "Not available";
    $scope.actionVideo = "Not available";
    $scope.actionSharing = "Not available";

    $scope.presenceValue = "notAvailable";

    $scope.isAvailable = false;

    this.$onInit = function () {
      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStart
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to contact change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );

      // Subscribe to contact change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONINFORMATIONCHANGED,
          onContactsInformationChanged
        )
      );
    };

    this.$onDestroy = function () {
      var listener = listeners.pop();
      while (listener) {
        listener();
        listener = listeners.pop();
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      __event
    ) {
      var status = event.detail;

      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else if (
        status === rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED
      ) {
        $scope.isConnected = false;
        $scope.contacts = [
          {
            _displayName: "No recipient",
            id: "no",
            status: "offline",
            avatar: { src: null },
          },
        ];
        $scope.selectedItem = $scope.contacts[0];
        changeRecipientValue();
      }
    };

    var onStart = function onStart() {
      var contacts = rainbowSDK.contacts.getAll();

      contacts = contacts.filter(function (contact) {
        return contact.id !== rainbowSDK.contacts.getConnectedUser().id;
      });

      if (contacts && contacts.length) {
        $scope.contacts = contacts;
        $scope.selectedItem = $scope.contacts[0];
        changeRecipientValue();
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if ($scope.selectedItem) {
        if ($scope.selectedItem.id === contact.id) {
          changeRecipientValue();
        }
      }
    };

    var changeRecipientValue = function changeRecipientValue() {
      if ($scope.selectedItem) {
        $scope.avatar = $scope.selectedItem.avatar.src;
        $scope.presenceValue = displayPresenceOfContact();
        $scope.actionAudio =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Audio call";
        $scope.actionVideo =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Call";
        $scope.actionSharing =
          $scope.presenceValue === "notAvailable"
            ? "Not Available"
            : $scope.presenceValue === "busy"
            ? "Busy"
            : "Sharing Call";
        $scope.isAvailable =
          $scope.presenceValue === "available" ? true : false;
      }
    };

    var displayPresenceOfContact = function displayPresenceOfContact() {
      switch ($scope.selectedItem.status) {
        case "online":
        case "away":
          return "available";
        case "busy":
        case "dnd":
          return "busy";
        case "offline":
        case "unknown":
        default:
          return "notAvailable";
      }
    };

    $scope.changeValue = function () {
      console.log("DEMO :: Selected recipient changed", $scope.selectedItem);
      changeRecipientValue();
    };

    $scope.callAudio = function callAudio() {
      if ($scope.selectedItem) {
        if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
          rainbowSDK.webRTC.callInAudio($scope.selectedItem);
        } else {
          console.log("DEMO :: Your browser can't make audio and video call!");
        }
      }
    };

    $scope.callVideo = function callVideo() {
      if ($scope.selectedItem) {
        if (rainbowSDK.webRTC.canMakeAudioVideoCall()) {
          rainbowSDK.webRTC.callInVideo($scope.selectedItem);
        } else {
          console.log("DEMO :: Your browser can't make audio and video call!");
        }
      }
    };

    $scope.callSharing = function callSharing() {
      if ($scope.selectedItem) {
        rainbowSDK.webRTC
          .canMakeDesktopSharingCall()
          .then(function () {
            rainbowSDK.webRTC.callInSharing($scope.selectedItem);
          })
          .catch(function () {
            console.log("DEMO :: Your browser can't make sharing call!");
          });
      }
    };
  },
  templateUrl: "../video/src/js/components/contact/contactCmp.template.html",
});


angular.module("abs.teleconsultation.video").component("rbxController", {
  bindings: {
    name: "@",
  },
  templateUrl: "../video/src/js/components/controller/controllerCmp.template.html",
  controller:['Call',function rbcPhoneCtrl($rootScope, $scope,Call) {
    "use strict";
	scope.isPlaying=true;
	$scope.playing="testMe";
    $scope.isConnected = false;

    $scope.isInCommunication = false;

    $scope.isPIPDisplayed = true;

    $scope.isRemoteVideoDisplayed = true;

    $scope.isSpectrumDisplayed = false;

    $scope.hasLocalVideo = false; //Compute local

    $scope.hasRemoteVideo = false; // compute remote

    $scope.isCheckedDisplayed = true;

    $scope.title = "Please wait...";

    $scope.message = "The browser is checking your audio and video devices";

    var currentCall = null;

    this.$onInit = function () {
      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
        onConnectionStateChangeEvent
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED,
        onWebRTCCallChanged
      );

	
	   
	   
      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCTMEDIAERROROCCURED,
        onWebRTCGetUserMediaErrorOccured
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCTRACKCHANGED,
        onWebRTCTrackChanged
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONCONVERSATIONCHANGED,
        onConversationChanged
      );

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_START", onDeviceCheckStart);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_END", onDeviceCheckEnd);

      $rootScope.$on("DEMO_ON_CHECK_DEVICES_FAILED", onDeviceCheckFailed);
    };

    this.$onDestroy = function () {};

    var onDeviceCheckStart = function onDeviceCheckStart() {
      console.log("[DEMO] :: Start checking devices...");
    };

    var onDeviceCheckEnd = function onDeviceCheckEnd() {
      $scope.$apply(function () {
        console.log("[DEMO] :: Devices checking finished!");
        $scope.isCheckedDisplayed = false;
      });
    };

    var onDeviceCheckFailed = function onDeviceCheckFailed() {
      $scope.title = "WARNING !";
      $scope.message =
        "This demo will not work on this browser (not compatible)";
    };

    var onConversationChanged = function onConversationChanged(event) {
      var conversation = event.detail;
      console.log("[DEMO] :: Conversation changed", conversation);
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else if (
        status === rainbowSDK.connection.RAINBOW_CONNECTIONDISCONNECTED
      ) {
        $scope.isConnected = false;
      }
    };

    var onWebRTCGetUserMediaErrorOccured = function onWebRTCGetUserMediaErrorOccured(
      event
    ) {
      var error = event.detail;
      console.log("[DEMO] :: WebRTC GetUserMedia error occurs", error);
    };

    var onWebRTCCallChanged = function onWebRTCCallChanged(event, call) {
      var call = event.detail;
      console.log(
        "[DEMO] :: WebRTC Call state changed to " + call.status.value,
        call
      );

      switch (call.status.value) {
        case Call.Status.RINGING_INCOMMING.value:
          if (call.remoteMedia & Call.Media.VIDEO) {
            answerInVideo(call);
          } else {
            answerInAudio(call);
          }
          break;

        case Call.Status.ACTIVE.value:
          if (call.remoteMedia & Call.Media.VIDEO) {
            displayRemoteVideo(call);
          } else {
            hideRemoteVideo(call);
          }

          if (call.localMedia & Call.Media.VIDEO) {
            displayLocalVideo(call);
          } else {
            hideLocalVideo(call);
          }
          $scope.isInCommunication = true;
          break;

        case Call.Status.UNKNOWN.value:
          hideLocalVideo();
          hideRemoteVideo(call);
          $scope.isInCommunication = false;
          break;

        default:
          console.log("[DEMO] :: Nothing to do with that event...");
          break;
      }

      currentCall = call;
    };

    var onWebRTCTrackChanged = function onWebRTCTrackChanged(event) {
      var call = event.detail;
      console.log(
        "[DEMO] :: WebRTC Track changed local|remote " +
          call.localMedia +
          "|" +
          call.remoteMedia
      );
      // Manage remote video
      if (call.remoteMedia & Call.Media.VIDEO) {
        displayRemoteVideo(call);
      } else {
        hideRemoteVideo(call);
      }
      // Manage local video
      if (call.localMedia & Call.Media.VIDEO) {
        displayLocalVideo(call);
      } else {
        hideLocalVideo(call);
      }
    };

    var answerInVideo = function answerInVideo(call) {
      console.log("[DEMO] :: Answer in video");
      rainbowSDK.webRTC.answerInVideo(call);
    };

    var answerInAudio = function answerInAudio(call) {
      console.log("[DEMO] :: Answer in audio");
      rainbowSDK.webRTC.answerInAudio(call);
    };

    var displayRemoteVideo = function displayRemoteVideo(call) {
      console.log("[DEMO] :: Display remote video");
      rainbowSDK.webRTC.showRemoteVideo(call);
      $scope.hasRemoteVideo = true;
    };

    var hideRemoteVideo = function hideRemoteVideo(call) {
      console.log("[DEMO] :: Hide remote video");
      rainbowSDK.webRTC.hideRemoteVideo(call);
      $scope.hasRemoteVideo = false;
    };

    var displayLocalVideo = function displayLocalVideo() {
      console.log("[DEMO] :: Display local video");
      rainbowSDK.webRTC.showLocalVideo();
      $scope.hasLocalVideo = true;
    };

    var hideLocalVideo = function hideLocalVideo() {
      console.log("[DEMO] :: Hide local video");
      rainbowSDK.webRTC.hideLocalVideo();
      $scope.hasLocalVideo = false;
    };

    $scope.hidePIP = function hidePIP() {
      rainbowSDK.webRTC.hideLocalVideo();
      $scope.isPIPDisplayed = false;
    };

    $scope.showPIP = function showPIP() {
      rainbowSDK.webRTC.showLocalVideo();
      $scope.isPIPDisplayed = true;
    };

    $scope.hideRemote = function hideRemote() {
      rainbowSDK.webRTC.hideRemoteVideo(currentCall);
      $scope.isRemoteVideoDisplayed = false;
    };

    $scope.showRemote = function showRemote() {
      rainbowSDK.webRTC.showRemoteVideo(currentCall);
      $scope.isRemoteVideoDisplayed = true;
    };

    $scope.addVideo = function addVideo() {
      rainbowSDK.webRTC.addVideoToCall(currentCall);
    };

    $scope.removeVideo = function removeVideo() {
      rainbowSDK.webRTC.removeVideoFromCall(currentCall);
    };

    $scope.release = function release() {
      rainbowSDK.webRTC.release(currentCall);
    };

    $scope.showSpectrum = function showSpectrum() {
      $scope.isSpectrumDisplayed = true;
      $rootScope.$broadcast(
        "DEMO_ON_SPECTRUM_DISPLAY",
        $scope.isSpectrumDisplayed
      );
    };

    $scope.hideSpectrum = function hideSpectrum() {
      $scope.isSpectrumDisplayed = false;
      $rootScope.$broadcast(
        "DEMO_ON_SPECTRUM_DISPLAY",
        $scope.isSpectrumDisplayed
      );
    };

    $scope.mute = function mute() {
      var conversationId = currentCall.conversationId;
      var conversation = rainbowSDK.conversations.getConversationById(
        conversationId
      );

      if (conversation) {
        rainbowSDK.webRTC.muteVideoCall(conversation);
        $scope.isMuted = true;
      }
    };

    $scope.unmute = function unmute() {
      var conversationId = currentCall.conversationId;
      var conversation = rainbowSDK.conversations.getConversationById(
        conversationId
      );

      if (conversation) {
        rainbowSDK.webRTC.unmuteVideoCall(conversation);
        $scope.isMuted = false;
      }
    };
  }],
});


angular.module("abs.teleconsultation.video").component("rbxMedia", {
  bindings: {
    name: "@",
  },
  controller:function rbcPhoneCtrl($rootScope, $scope,$timeout) {
    "use strict";

    var listeners = [];

    $scope.microphones = [];

    $scope.speakers = [];

    $scope.cameras = [];

    $scope.isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    $scope.isFirefox =
      navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    $scope.isOther = !($scope.isChrome || $scope.isFirefox);

    $timeout(function () {
      initialize();
    }, 1000);

    this.$onInit = function () {};

    var initialize = function initialize() {
      if ($scope.isChrome) {
        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_START");

        // Enumerate the list of available media device
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then(function (stream) {
            console.log("[DEMO] :: Get user media ok... Enumerate devices...");
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
            navigator.mediaDevices
              .enumerateDevices()
              .then(gotDevices)
              .catch(handleError);
          })
          .catch(function (error) {
            console.log(
              "[DEMO] :: Unable to have access to media devices",
              error
            );
          });
      } else if ($scope.isFirefox) {
        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
      } else {
        $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_FAILED");
      }

      // Subscribe to WebRTC error
      listeners.push(
        document.addEventListener(
          rainbowSDK.webRTC.RAINBOW_ONWEBRTCERRORHANDLED,
          onWebRTCErrorHandled
        )
      );
    };

    var onWebRTCErrorHandled = function onWebRTCErrorHandled(event) {
      var error = event.detail;
      console.log("[DEMO] :: WebRTC Error", error);
      $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
    };

    var gotDevices = function gotDevices(devices) {
      devices.forEach(function (device) {
        switch (device.kind) {
          case "audioinput":
            $scope.microphones.push(device);
            break;
          case "audiooutput":
            $scope.speakers.push(device);
            break;
          case "videoinput":
            $scope.cameras.push(device);
            break;
          default:
            console.log("Strange...", device);
            break;
        }
      });

      if ($scope.microphones.length === 0) {
        $scope.microphones.push({
          deviceId: "default",
          groupId: "2029518264",
          kind: "audioinput",
          label: "No microphone",
        });
      }

      if ($scope.speakers.length === 0) {
        $scope.speakers.push({
          deviceId: "default",
          groupId: "2029518264",
          kind: "audioinput",
          label: "No speaker",
        });
      }

      if ($scope.cameras.length === 0) {
        $scope.cameras.push({
          deviceId: "default",
          groupId: "2029518264",
          kind: "audioinput",
          label: "No camera",
        });
      }
      $scope.$apply(function () {
        $scope.selectedMicrophone = $scope.microphones[0];
        $scope.selectedSpeaker = $scope.speakers[0];
        $scope.selectedCamera = $scope.cameras[0];
      });

      $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
    };

    var handleError = function handleError(error) {
      console.log("[DEMO] :: Devices error", error);
      $rootScope.$broadcast("DEMO_ON_CHECK_DEVICES_END");
    };

    this.$onDestroy = function () {};

    $scope.changeMicrophone = function () {
      console.log(
        "[DEMO] :: Change microphone to " + $scope.selectedMicrophone.label
      );
      rainbowSDK.webRTC.useMicrophone($scope.selectedMicrophone.deviceId);
    };

    $scope.changeSpeaker = function () {
      console.log(
        "[DEMO] :: Change speaker to " + $scope.selectedSpeaker.label
      );
      rainbowSDK.webRTC.useSpeaker($scope.selectedSpeaker.deviceId);
    };

    $scope.changeCamera = function () {
      console.log("[DEMO] :: Change camera to " + $scope.selectedCamera.label);
      rainbowSDK.webRTC.useCamera($scope.selectedCamera.deviceId);
    };
  },
  templateUrl: "../video/src/js/components/media/mediaCmp.template.html",
});


angular.module("abs.teleconsultation.video").component("rbxSpectrum", {
  bindings: {},

  templateUrl: "../video/src/js/components/spectrum/spectrumCmp.template.html",

  controller:['Call', function rbcPhoneCtrl($rootScope, $scope, Call) {
    "use strict";

    var audioContext = new AudioContext();
    var ctx = null;
    var gradient = null;
    var javascriptNode = null;
    var remoteMediaStream = null;
    var analyser = null;
    var isSpectrumStarted = false;

    $scope.isInCommunication = false;
    $scope.isSpectrumDisplayed = false;

    this.$onInit = function () {
      // get the context from the canvas to draw on
      ctx = $("#canvasSound").get()[0].getContext("2d");

      // create a gradient for the fill. Note the strange
      // offset, since the gradient is calculated based on
      // the canvas, not the specific element we draw
      gradient = ctx.createLinearGradient(0, 0, 100, 0);

      gradient.addColorStop(1, "red");
      gradient.addColorStop(0.83, "orange");
      gradient.addColorStop(0.66, "yellow");
      gradient.addColorStop(0.5, "green");
      gradient.addColorStop(0.33, "blue");
      gradient.addColorStop(0.16, "indigo");
      gradient.addColorStop(0, "violet");

      // Subscribe to contact change
      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCCALLSTATECHANGED,
        onWebRTCCallChanged
      );

      document.addEventListener(
        rainbowSDK.webRTC.RAINBOW_ONWEBRTCSTREAMADDED,
        onWebRTCStreamAdded
      );

      $rootScope.$on(
        "$destroy",
        $rootScope.$on("DEMO_ON_SPECTRUM_DISPLAY", onSpectrumDisplayChanged)
      );
    };

    this.$onDestroy = function () {};

    var onWebRTCStreamAdded = function onWebRTCStreamAdded(event) {
      var streams = event.detail;
      console.log("[DEMO] :: >>> WebRTC stream added", streams);
      if (!isSpectrumStarted) {
        startSpectrum(streams);
      }
    };

    var onSpectrumDisplayChanged = function onSpectrumDisplayChanged(
      __event,
      isDisplayed
    ) {
      $scope.isSpectrumDisplayed = isDisplayed;
    };

    var onWebRTCCallChanged = function onWebRTCCallChanged(event) {
      var call = event.detail;

      switch (call.status.value) {
        case Call.Status.RINGING_INCOMMING.value:
          break;

        case Call.Status.ACTIVE.value:
          $scope.isInCommunication = true;
          break;

        case Call.Status.UNKNOWN.value:
          $scope.isInCommunication = false;
          stopSpectrum();
          break;

        default:
          break;
      }
    };

    var drawSpectrum = function drawSpectrum(array) {
      for (var i = 0; i < array.length; i++) {
        var value = array[i];
        ctx.fillRect(0, i * 3, value / 2.56, 2);
      }
    };

    var stopSpectrum = function stopSpectrum() {
      isSpectrumStarted = false;

      if (javascriptNode) {
        javascriptNode.disconnect();
      }

      if (remoteMediaStream) {
        remoteMediaStream.disconnect();
      }

      if (analyser) {
        analyser.disconnect();
      }
    };

    var startSpectrum = function manageSpectrum(streams) {
      console.log("[DEMO] :: WebRTC manageSpectrum");

      var listOfRemoteStreams = streams;

      var nWhichStream = 0;

      // Error ?  Bad call ?
      if (listOfRemoteStreams.length > 0) {
        console.log(
          "[DEMO] :: WebRTC manageSpectrum streams",
          listOfRemoteStreams
        );

        // Which stream ?
        if (listOfRemoteStreams.length > 1) {
          // TODO
          nWhichStream = 0;
        }

        // check for the stream
        var audioTracks = listOfRemoteStreams[nWhichStream].getAudioTracks();

        console.log("[DEMO] :: WebRTC manageSpectrum streams", audioTracks);

        if (audioTracks && audioTracks.length === 1) {
          // Get the remote stream and use it in the Audio stream
          remoteMediaStream = audioContext.createMediaStreamSource(
            listOfRemoteStreams[nWhichStream]
          );
          javascriptNode = audioContext.createScriptProcessor(1024, 1, 1);

          remoteMediaStream.connect(javascriptNode);

          // setup a analyzer
          analyser = audioContext.createAnalyser();
          analyser.smoothingTimeConstant = 0.3;
          analyser.fftSize = 512;

          // create a buffer source node
          remoteMediaStream.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          isSpectrumStarted = true;

          javascriptNode.onaudioprocess = function (__event) {
            // get the average for the first channel
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            // clear the current state
            //ctx.clearRect(0, 0, 500, 100);
            ctx.clearRect(0, 0, 100, 500);
            //ctx.fillRect(0, 0, 500, 20);

            // set the fill style
            ctx.fillStyle = gradient;
            drawSpectrum(array);
          };
        }
      } else {
        console.log("[DEMO] :: WebRTC manageSpectrum no stream found");
      }
    };
  }],
   
  
  
})
 
angular.module("abs.teleconsultation.video").component("rbxConversation", {
  bindings: {
    item: "=",
  },
  controller:  function ($rootScope, $scope) {
    var ctrl = $scope;

    var handlers = [];

    $scope.message = "";

    $scope.onSend = function () {
      rainbowSDK.im.sendMessageToConversation(
        $scope.conversation,
        $scope.message
      );
      $scope.message = "";
    };

    var onConversationChanged = function onConversationChanged() {
      setTimeout(function () {
        var containerHeight = $(".conversation-" + ctrl.conversation.dbId)[0]
          .scrollHeight;
        var container = angular.element(
          ".conversation-" + ctrl.conversation.dbId
        );
        container.animate({ scrollTop: containerHeight }, 100);
      }, 100);
    };

    this.$onInit = function () {
      $scope.contact = this.item.contact;

      $scope.conversation = this.item;

      rainbowSDK.im
        .getMessagesFromConversation(this.item, 50)
        .then(function (__messages) {
          onConversationChanged();
        });

      // Subscribe to XMPP connection change
      handlers.push($rootScope.$on(this.item.id, onConversationChanged));

      var container = angular.element(
        ".conversation-" + ctrl.conversation.dbId
      );

      container.on("scroll", function (__event) {
        if (container.scrollTop() <= 0) {
          //Load older messages
          rainbowSDK.im
            .getMessagesFromConversation($scope.conversation, 30)
            .then(function () {})
            .catch(function () {});
        }
      });
    };

    this.$onDestroy = function () {
      var handler = handlers.pop();
      while (handler) {
        handler();
        handler = handlers.pop();
      }
    };
  },
  templateUrl:"../chat/src/js/components/conversations/conversationCmp.template.html",
});



angular.module("abs.teleconsultation.video").component("rbxConversations", {
  bindings: {
    name: "@",
    conversations: "=",
  },
  controller:function rbcConnectionsCtrl($rootScope, $scope, $timeout) {
    $scope.conversations = [];

    var getAllOneToOneConversations = function getAllOneToOneConversations() {
      var conversations = rainbowSDK.conversations.getAllConversations();

      var oneToOneConversations = [];

      conversations.forEach(function (conversation) {
        if (conversation.type === 0) {
          oneToOneConversations.push(conversation);
        }
      });

      return oneToOneConversations;
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event,
      status
    ) {
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.conversations = getAllOneToOneConversations();
      } else {
        $scope.conversations = [];
      }
    };

    var onConversationsListChanged = function onConversationsListChanged(
      event,
      conversation
    ) {
      $scope.conversations = $scope.conversations = getAllOneToOneConversations();
    };

    var onConversationChanged = function (__event, conversationID) {
      $rootScope.$broadcast(conversationID, null);
    };

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONSCHANGED,
      onConversationsListChanged
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONREMOVED,
      onConversationsListChanged
    );

    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent
    );

    document.addEventListener(
      rainbowSDK.conversations.RAINBOW_ONCONVERSATIONCHANGED,
      onConversationChanged
    );
  },
  templateUrl: "../chat/src/js/components/conversations/conversationsCmp.template.html",
});


angular.module("abs.teleconsultation.video").component("rbxMessage", {
  bindings: {
    item: "<",
  },
  controller: function ($rootScope,$scope,$interval) {
    var ctrl = $scope;

    this.$onInit = function () {
      var updateDateFields = function () {
        var mdate = moment($scope.$ctrl.item.date);

        if (moment().diff(mdate, "days") == 0) {
          return mdate.fromNow();
        } else {
          return mdate.format("lll");
        }
        return d;
      };

      $scope.date = updateDateFields();

      // Arm update date timer
      $interval(
        function ($scope) {
          ctrl.date = updateDateFields();
          ctrl.$apply();
        },
        30000,
        0,
        false
      );
    };
  },
  templateUrl: "../chat/src/js/components/conversations/messageCmp.template.html",
});

  

;


