/*
 * File: index.js
 * Description: File that configures the skill with Lambda
 */

'use strict';

const Alexa = require('ask-sdk');
const settings = require('./config/settings.js');
const logger = require('./utils/logger.js');

/**
 * Import interceptors and handlers for the different skill states.
 */
const DefaultHandlers = require('./handlers/defaultHandlers');
const CustomHandlers = require('./handlers/customHandlers');

/**
 * Lambda setup.
 */
exports.handler = function (event, context) {
  let factory = Alexa.SkillBuilders.standard()
    .addRequestHandlers(
      CustomHandlers.InProgressGetTimetableIntent,
      CustomHandlers.CompletedGetTimetableIntent,
      DefaultHandlers.LaunchHandler,
      DefaultHandlers.HelpHandler,
      DefaultHandlers.StopCancelHandler,
      DefaultHandlers.SessionEndedRequestHandler,
      DefaultHandlers.DefaultHandler
    )
    .addRequestInterceptors(DefaultHandlers.RequestInterceptor)
    .addResponseInterceptors(DefaultHandlers.ResponseInterceptor)
    .addErrorHandlers(DefaultHandlers.ErrorHandler);

  if (settings.APP_ID) {
    factory.withSkillId(settings.APP_ID);
  }

  let skill = factory.create();

  return skill.invoke(event, context);
}