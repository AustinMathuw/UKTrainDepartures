/*
 * File: settings.js
 * Description: File that configures the behavior of the game
 */

"use strict";

module.exports = (function () {
  /**
   * APP_ID:
   *  The skill ID to be matched against requests for confirmation.
   *  It helps protect against spamming your skill.
   *  This value can also be configured in lambda as described in the Hackster instructions.
   */

  const APP_ID = '';

  const API_URL = function (station) {
    return "https://transportapi.com/v3/uk/train/station/"+station+"/live.json?app_id=a77134ac&app_key=15c54e4f03f441f62ed9195a7fe16f22&darwin=false&train_status=passenger"
  }

  const APL_ENABLED = true;

  const AUDIO = Object.freeze({
      
  });

  /**
   * A set of images to show on backgrounds and in display templates when the skill
   * is used with a device with a screen like the Echo Show or Echo Spot
   * https://developer.amazon.com/docs/custom-skills/display-interface-reference.html
   *
   * The skill template chooses images randomly from each array to provide some
   * variety for the user.
   * 
   * Update with new links from S3
   */
  const IMAGES = Object.freeze({
    BACKGROUND_IMAGES: [
      'https://s3.amazonaws.com/austinmatthuw/Train+Times/background.jpg',
    ],
    LOGO: "https://s3.amazonaws.com/austinmatthuw/Train+Times/icon_512_A2Z.png",
    LATE: "https://s3.amazonaws.com/austinmatthuw/Train+Times/late.png",
    ON_TIME: "https://s3.amazonaws.com/austinmatthuw/Train+Times/ontime.png",
    DELAYED: "https://s3.amazonaws.com/austinmatthuw/Train+Times/delayed.png"
  });

  // return the externally exposed settings object
  return Object.freeze({
    SKILL_TITLE: 'UK Train Departures',
    API_URL: API_URL,
    APP_ID: APP_ID,
    APL_ENABLED: APL_ENABLED,
    STORAGE: STORAGE,
    AUDIO: AUDIO,
    IMAGES: IMAGES,
    LOG_LEVEL: 'DEBUG',
    pickRandom(arry) {
      if (Array.isArray(arry)) {
        return arry[Math.floor(Math.random() * Math.floor(arry.length))]
      }
      return arry;
    }
  });
})();