/*
 * File: display.js
 * Description: Defines helper methods to create the visuals of the skill
 *    for screen-enabled devices.
 */

const Alexa = require('ask-sdk');
const settings = require('../config/settings.js');
const directives = require('../utils/directives.js');
const logger = require('../utils/logger.js');

const Display = {
  // Render the default view
  renderDefault: function (
    /* The Alexa request and attributes */
    handlerInput,
    {
      displayTitle,
      /* primary text content to display */
      displayText,
      /* (optional) secondary text content to display */
      displaySubText,
      /* a background image to be displayed under the text content */
      backgroundImage,
      /* (optional) an image to be displayed on the side of the text content */
      image
    } = {}) {
    let isAPL = settings.APL_ENABLED;
    let ctx = handlerInput.attributesManager.getRequestAttributes();

    /**
     * Check for display
     */
    if (!handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
      logger.debug('No display to render.');
      return;
    }

    /**
     * Check if display supports APL and our skill is in APL mode
     */
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"] && isAPL) {
      logger.debug('Display does support APL');
    } else {
      logger.debug('Display does not support APL');
      isAPL = false;
    }

    if (!displayText) {
      logger.warn('Render template without primary text!');
    }

    let text = displayText || '';
    if (Array.isArray(text)) {
      text = settings.pickRandom(text);
    }

    let subText = displaySubText || '';
    if (Array.isArray(subText)) {
      subText = settings.pickRandom(subText);
    }

    const background = backgroundImage || settings.pickRandom(settings.IMAGES.BACKGROUND_IMAGES);

    // Determine if we will render in APL or RenderTemplate
    if(isAPL) {
      ctx.directives.push(directives.APL.setDefaultDisplay(
        background,
        displayTitle,
        displayText,
        settings.IMAGES.LOGO,
        settings.pickRandom(ctx.t('HINT'))
      ));
    } else {
      // Rich can handle plain as well
      const textContent = new Alexa.RichTextContentHelper()
        .withPrimaryText(text)
        .withSecondaryText(subText)
        .getTextContent();

      const renderBackground = new Alexa.ImageHelper()
        .addImageInstance(background)
        .getImage();

      ctx.directives.push(directives.Hint.setHint(
        settings.pickRandom(ctx.t('HINT'))
      ));

      if (image) {
        var renderImage = new Alexa.ImageHelper()
          .addImageInstance(image)
          .getImage();
        ctx.renderTemplate = {
          type: 'BodyTemplate3',
          backButton: 'HIDDEN',
          backgroundImage: renderBackground,
          title: displayTitle,
          image: renderImage,
          textContent: textContent
        }
      } else {
        ctx.renderTemplate = {
          type: 'BodyTemplate1',
          backButton: 'HIDDEN',
          backgroundImage: renderBackground,
          title: displayTitle,
          textContent: textContent
        }
      }
    }
  },

  // Render the song view
  renderTimetable: function (
    /* The Alexa request and attributes */
    handlerInput, trains) {
    let isAPL = settings.APL_ENABLED;
    let ctx = handlerInput.attributesManager.getRequestAttributes();
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    /**
     * Check for display
     */
    if (!handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
      logger.debug('No display to render.');
      return;
    }

    /**
     * Check if display supports APL and our skill is in APL mode
     */
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"] && isAPL) {
      logger.debug('Display does support APL');
    } else {
      logger.debug('Display does not support APL');
      isAPL = false;
    }

    const background = settings.pickRandom(settings.IMAGES.BACKGROUND_IMAGES);

    // Determine if we will render in APL or RenderTemplate
    if(isAPL) {
      ctx.directives.push(directives.APL.setTimetableDisplay(
        trains,
        background,
        settings.SKILL_TITLE,
        settings.IMAGES.LOGO,
        settings.pickRandom(ctx.t('HINT'))
      ));
    } else {
      return;
    }
  }
};
module.exports = Display;