/* import rainbowSDK from "../../../../node_modules/rainbow-web-sdk/src/rainbow-sdk.min.js"; */

import rainbowSDK from 'rainbow-web-sdk';
import css from "./sdkSampleApp.css";

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
      templateUrl: 'chat/src/view/chatview.html',
      controller: 'exachatController',
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

    rainbowSDK
      .initialize( appId, appSecret)
	  
	 
      .then(function () {
        console.log("[DEMO] :: Rainbow SDK is initialized!");
      })
      .catch(function () {
        console.log("[DEMO] :: Something went wrong with the SDK...");
      });

    this.initialize = function () {
      console.log("DEMO :: Rainbow Demo Application");

      document.addEventListener(rainbowSDK.RAINBOW_ONREADY, onReady);
    };

    this.initialize();

    return true;
  });
