/*
 * File: messages.js
 * Description: File that holds all of the speech outputs and their translations
 */

'use strict';

const settings = require('./settings');

// Game Title in English
const SKILL_TITLE = settings.SKILL_TITLE;

// Translations
const messages = {
  // Translations for English (ALL)
  en: {
    translation: {
      'WELCOME': {
        outputSpeech: 'Welcome to ' + SKILL_TITLE + '! Which station are you intrested in?',
        reprompt: "Sorry, I didn't catch that, what would you like to do next?",
        displayTitle: SKILL_TITLE + ' - Welcome',
        displayText: 'Which station are you intrested in?'
      },
      'NO_TRAINS': {
        reprompt: "Sorry, I didn't catch that, what would you like to do next?",
        displayTitle: SKILL_TITLE + ' - No Trains',
        displayText: 'There are no trains'
      },
      'GENERAL_HELP': {
        outputSpeech: 'Try asking me about the status of trains for a station. ' +
          'What would you like to do? ',
        reprompt: "Sorry, I didn't catch that, what would you like to do next?",
        displayTitle: SKILL_TITLE + ' - Help',
        displayText: 'I can tell you expected timetables of trains for a specific station.'
      },
      'UNHANDLED_REQUEST': {
        outputSpeech: "Sorry, I didn't get that. Please say again!",
        reprompt: "Please say it again. You can ask for help if you're not sure what to do."
      },
      'GOOD_BYE': {
        outputSpeech: "Ok, see you next time!",
        reprompt: ''
      },
      'HINT': [
          'Try, \"Alexa, departures from London Kings Cross\"'
      ],
      'NO_DELAY': "There are no delays",
      'MINOR_DELAY': "The trains are running a little late",
      'DELAY': "There are significant problems",
      'MAJOR_DELAY': "There are major problems",
      'API_CALL_ERROR': "There was an issue getting the information for that station! Please try again later!"
    }
  }
};

module.exports = messages;