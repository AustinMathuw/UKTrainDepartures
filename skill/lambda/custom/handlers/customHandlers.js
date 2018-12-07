/*
 * File: globalHandlers.js
 * Description: File that handlers the actual intent & event request globally
 */

const display = require('../utils/display.js');
const i18n = require('i18next');
const logger = require('../utils/logger.js');
const messages = require('../config/messages.js');
const settings = require('../config/settings.js');
const Timetable = require('../utils/timetables.js');

const customHandlers = {
  InProgressGetTimetableIntent: {
    canHandle(handlerInput) {
      logger.debug('CUSTOM.InProgressGetTimetableIntent: canHandle');
      let {
        requestEnvelope
      } = handlerInput;
      return requestEnvelope.request.type === 'IntentRequest'
        && requestEnvelope.request.intent.name === 'GetTimetableIntent'
        && requestEnvelope.request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
      logger.debug('CUSTOM.InProgressGetTimetableIntent: handle');
      let { responseBuilder, requestEnvelope } = handlerInput;
      const currentIntent = requestEnvelope.request.intent;
  
      return responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    },
  },

  /**
   * The player has requested to change song pack and has provided us with the pack to change to.
   */
  CompletedGetTimetableIntent: {
    canHandle(handlerInput) {
      logger.debug('CUSTOM.CompletedGetTimetableIntent: canHandle');
      let {
        requestEnvelope
      } = handlerInput;
      return requestEnvelope.request.type === 'IntentRequest'
        && requestEnvelope.request.intent.name === 'GetTimetableIntent'
        && requestEnvelope.request.dialogState === 'COMPLETED';
    },
    async handle(handlerInput) {
      logger.debug('CUSTOM.CompletedGetTimetableIntent: handle');
      await Timetable.getTimetable(handlerInput);
      return handlerInput.responseBuilder.getResponse();
    }
  }
}

module.exports = customHandlers;