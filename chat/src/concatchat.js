// import rainbowSDK from "../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js";

import rainbowSDK from 'rainbow-web-sdk';

import css1 from "./js/sdkSampleApp.css";
import css2 from "./js/components/connection/connectionCmp.css";
import css3 from "./js/components/conversations/conversationCmp.css";
import css4 from "./js/components/conversations/conversationsCmp.css";
import css5 from "./js/components/conversations/messageCmp.css";
import css6 from "./js/components/user/userCmp.css";
import css7 from "./js/components/presence/presenceCmp.css";
import css8 from "./js/components/contacts/contactCmp.css";
import css9 from "./js/components/contacts/contactsCmp.css";
	  
/* ALLOW MANIPULATING SDK FROM THE BROWSER CONSOLE */
window.r = rainbowSDK;

angular.module("abs.teleconsultation.chat", [
	'ngResource',
    'ngSanitize',
    'satellizer',
    'ngAnimate',
    'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
/*    var getToken = {
        'TokenServiceData': function(TokenService, $q) {
            return $q.all({
                AuthServiceData: TokenService.promise,
                SettingServiceData: TokenService.promiseSettings
            });
        }
    }; */
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('DoctorChat', {
      url: '/chatdoc/',
      templateUrl: '../chat/src/views/chatview.html',
      controller: 'exachatController',
	  //controller: 'MainController',
 //     resolve: getToken
    });
})
.controller("exachatController", function () {
    "use strict";

    /*********************************************************/
    /**                INITIALIZATION STUFF                 **/
    /*********************************************************/
    var appId = "16a2cce0ac1911ebbe33e9ed28980ec8";
    var appSecret = "ZphIJDzvCMURdQ61FssxmwpcMbougDmEpZwYuNRM1sro6hSkc861Vt3J8CDRyPUs";

    var onReady = function onReady() {
      console.log("[DEMO] :: Rainbow SDK is ready!");
    };

	var onLoaded = function onLoaded() {
		console.log("[DEMO] :: On SDK Loaded !");
		  
		// Activate full SDK log
        rainbowSDK.setVerboseLog(true);
    
		rainbowSDK
			.initialize( appId, appSecret)
			.then(function () {
				console.log("[DEMO] :: Rainbow SDK is initialized!");
			})
			.catch(function (err) {
				console.log("[DEMO] :: Something went wrong with the SDK...",err);
			});
	 };
		
      /* Listen to the SDK event RAINBOW_ONREADY */
    document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady)

    /* Listen to the SDK event RAINBOW_ONLOADED */
    document.addEventListener(rainbowSDK.RAINBOW_ONLOADED, onLoaded)

    /* Load the SDK */
    rainbowSDK.load();
    });

angular.module("abs.teleconsultation.chat").component("rbxConnection", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.isLoading = false;

    $scope.state = rainbowSDK.connection.getState();

    $scope.hosts = [
      {
        id: 0,
        value: "sandbox",
        name: "Rainbow Sandbox",
      },
      {
        id: 1,
        value: "rainbow",
        name: "Rainbow Official",
      },
    ];

    $scope.selectedItem = $scope.hosts[0];

    var handlers = [];

    $scope.signin = function () {
      $scope.isLoading = true;

      saveToStorage();

      switch ($scope.selectedItem.value) {
        case "rainbow":
          rainbowSDK.connection
            .signinOnRainbowOfficial($scope.user.name, $scope.user.password)
            .then(function (account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.isLoading = false;
              $scope.isConnected = true;
            })
            .catch(function (err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
            });
          break;
        default:
          rainbowSDK.connection
            .signin($scope.user.name, $scope.user.password)
            .then(function (account) {
              console.log("[DEMO] :: Successfully signed!");
              $scope.$apply(function () {
                $scope.isLoading = false;
                $scope.isConnected = true;
              });
            })
            .catch(function (err) {
              console.log("[DEMO] :: Error when sign-in", err);
              $scope.isLoading = false;
              $scope.isConnected = false;
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
        $scope.user = { name: "", password: "" };
      }

      if (sessionStorage.host) {
        $scope.selectedItem =
          $scope.hosts[angular.fromJson(sessionStorage.host).id];
      } else {
        $scope.selectedItem = $scope.hosts[0];
      }
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      $scope.state = rainbowSDK.connection.getState();
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
        onConnectionStateChangeEvent
      );
    };

    initialize();
  },
  templateUrl: "../chat/src/js/components/connection/connectionCmp.template.html",
});



angular.module("abs.teleconsultation.chat").component("rbxConversation", {
  bindings: {
    item: "=",
  },
  controller: function ($rootScope, $scope) {
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



angular.module("abs.teleconsultation.chat").component("rbxConversations", {
  bindings: {
    name: "@",
    conversations: "=",
  },
  controller: function rbcConnectionsCtrl($rootScope, $scope, $timeout) {
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


angular.module("abs.teleconsultation.chat").component("rbxMessage", {
  bindings: {
    item: "<",
  },
  controller: function ($scope, $interval) {
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


angular.module("abs.teleconsultation.chat").component("rbxUser", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.user = false;

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
        onStarted();
      } else {
        $scope.isConnected = false;
        $scope.user = null;
      }
    };

    var onInformationChanged = function onInformationChanged(event) {
      var user = event.detail;
      if (!$scope.user) {
        $scope.user = user;
      } else {
        // Track changes
      }
    };

    var onStarted = function onReady() {
      // Get the connected user information
      $scope.user = rainbowSDK.contacts.getConnectedUser();

      // Subscribe to XMPP connection change
      document.addEventListener(
        rainbowSDK.contacts.RAINBOW_ONINFORMATIONCHANGED,
        onInformationChanged
      );
    };

    // Subscribe to XMPP connection change
    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent
    );

    // Subscribe to XMPP connection change
  },
  templateUrl: "../chat/src/js/components/user/userCmp.template.html",
});


angular.module("abs.teleconsultation.chat").component("rbxPresence", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.presence = "offline";

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;

      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.presence = "offline";
      }
    };

    var onPresenceChanged = function onPresenceChanged(event) {
      var json = event.detail;
      $scope.presence = json.status;
    };

    $scope.online = function () {
      rainbowSDK.presence.setPresenceTo(
        rainbowSDK.presence.RAINBOW_PRESENCE_ONLINE
      );
    };

    $scope.away = function () {
      rainbowSDK.presence.setPresenceTo(
        rainbowSDK.presence.RAINBOW_PRESENCE_AWAY
      );
    };

    $scope.dnd = function () {
      rainbowSDK.presence.setPresenceTo(
        rainbowSDK.presence.RAINBOW_PRESENCE_DONOTDISTURB
      );
    };

    // Subscribe to XMPP connection change
    document.addEventListener(
      rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
      onConnectionStateChangeEvent
    );

    // Subscribe to XMPP connection change
    document.addEventListener(
      rainbowSDK.presence.RAINBOW_ONPRESENCECHANGED,
      onPresenceChanged
    );
  },
  templateUrl: "../chat/src/js/components/presence/presenceCmp.template.html",
});



angular.module("abs.teleconsultation.chat").component("rbxContact", {
  bindings: {
    item: "<",
  },
  controller: function ($scope) {
    this.$onInit = function () {
      var ctrl = $scope;

      $scope.isConnectedUser = false;

      $scope.createConversation = function () {
        rainbowSDK.conversations
          .openConversationForContact($scope.$ctrl.item)
          .then(function (conversation) {})
          .catch(function () {
            console.log("ERROR");
          });
      };

      $scope.closeConversation = function () {
        rainbowSDK.conversations
          .closeConversation($scope.$ctrl.item.conversation)
          .then(function (conversation) {})
          .catch(function () {
            console.log("ERROR");
          });
      };

      if (this.item.id === rainbowSDK.contacts.getConnectedUser().id) {
        console.log("Remove button");
        $scope.isConnectedUser = true;
      }
    };
  },
  templateUrl: "../chat/src/js/components/contacts/contactCmp.template.html",
});



angular.module("abs.teleconsultation.chat").component("rbxContacts", {
  bindings: {
    name: "@",
  },
  controller: function rbcConnectionCtrl($rootScope, $scope) {
    $scope.isConnected = false;

    $scope.nbContacts = 0;

    $scope.contacts = [];

    var listeners = [];

    this.$onInit = function () {
      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONSTARTED,
          onStarted
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.connection.RAINBOW_ONCONNECTIONSTATECHANGED,
          onConnectionStateChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.presence.RAINBOW_ONCONTACTPRESENCECHANGED,
          onContactPresenceChangeEvent
        )
      );

      // Subscribe to Contact information change connection changes
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
          onContactInformationChangeEvent
        )
      );

      // Subscribe to XMPP connection change
      listeners.push(
        document.addEventListener(
          rainbowSDK.contacts.RAINBOW_ONCONTACTINFORMATIONCHANGED,
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

    var onContactInformationChangeEvent = function onContactInformationChangeEvent(
      event
    ) {
      console.log("DEMO :: Contact information changed to ", event.detail);
    };

    var onContactPresenceChangeEvent = function onContactPresenceChangeEvent(
      event
    ) {
      console.log("DEMO :: presence changed to ", event.detail);
    };

    var countNumberOfContacts = function countNumberOfContacts() {
      $scope.nbContacts = Object.keys($scope.contacts).length;
    };

    var onStarted = function onReady() {
      $scope.contacts = rainbowSDK.contacts.getAll();
    };

    var onConnectionStateChangeEvent = function onConnectionStateChangeEvent(
      event
    ) {
      var status = event.detail;
      if (status === rainbowSDK.connection.RAINBOW_CONNECTIONCONNECTED) {
        $scope.isConnected = true;
      } else {
        $scope.isConnected = false;
        $scope.nbContacts = 0;
        $scope.contacts = {};
      }
    };

    var onContactsInformationChanged = function onContactsInformationChanged(
      event
    ) {
      var contact = event.detail;
      if (!(contact.id in $scope.contacts)) {
        $scope.contacts[contact.id] = contact;
        countNumberOfContacts();
      } else {
        // Track changes
      }
    };
  },
  templateUrl: "../chat/src/js/components/contacts/contactsCmp.template.html",
});

angular.module('abs').requires.push('abs.teleconsultation.chat');