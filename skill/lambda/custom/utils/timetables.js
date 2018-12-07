/*
 * File: timetables.js
 * Description: This file contains the calls to get departures, while the actual intent & event request
 *    handler can be found in the customHandlers.js file.
 */

'use strict';
var logger = require('../utils/logger.js');
var settings = require('../config/settings.js');
const request = require('request');
const moment = require('moment');

const helpers = {
    /**
     * Helper function to get the songs from a playlist
     */
    getTrains(station){
        return new Promise((resolve, reject) =>  {
            var url = settings.API_URL(station);
            request.get({
                url: url,
                json: true,
                headers: {'User-Agent': 'request'}
                }, (err, res, data) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        
                    } else if (res.statusCode !== 200) {
                        console.log(res.statusCode);
                        reject(res.statusCode);
                    } else {
                        var result = [];
                        for (var x in data.departures.all){
                            var train = data.departures.all[x];
                            var t = {};
                            t.destination_name = train.destination_name;
                            t.aimed_departure_time = train.aimed_departure_time;
                            t.expected_departure_time = train.expected_departure_time;
                            if (train.platform == null){
                                t.platform = "-";
                            } else {
                                t.platform = train.platform;
                            }
                            var aimed = moment(train.aimed_departure_time, 'HH:mm')
                            var expected = moment(train.expected_departure_time, 'HH:mm')
                            t.delay = expected.diff(aimed, 'minutes')
                            if (train.status == "CANCELLED"){
                                t.status = "CANCELLED";
                                t.delay = "999";
                            } else if (t.delay == 0){
                                t.status = "On Time";
                                t.statusImg = settings.IMAGES.ON_TIME;
                            } else if (0 < t.delay && t.delay < 10) {
                                t.status = "LATE";
                                t.statusImg = settings.IMAGES.LATE;
                            } else{
                                t.status = "DELAYED";
                                t.statusImg = settings.IMAGES.DELAYED;
                            }
                            if (t.delay == 0){
                                t.times = train.aimed_departure_time;
                            } else {
                                t.times = t.platform = train.aimed_departure_time+"\n"+train.expected_departure_time;
                            }
                            result.push(t);
                        }
                        console.log("here");
                        resolve(result);
                    }
                }
            );
        });
    },

    /**
     * Helper function to get the slot values from request
     */
    getSlotValues(filledSlots) {
        const slotValues = {};
      
        console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
        Object.keys(filledSlots).forEach((item) => {
          const name = filledSlots[item].name;
      
          if (filledSlots[item] &&
            filledSlots[item].resolutions &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
              case 'ER_SUCCESS_MATCH':
                slotValues[name] = {
                  synonym: filledSlots[item].value,
                  resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                  isValidated: true,
                };
                break;
              case 'ER_SUCCESS_NO_MATCH':
                slotValues[name] = {
                  synonym: filledSlots[item].value,
                  resolved: filledSlots[item].value,
                  isValidated: false,
                };
                break;
              default:
                break;
            }
          } else {
            slotValues[name] = {
              synonym: filledSlots[item].value,
              resolved: filledSlots[item].value,
              isValidated: false,
            };
          }
        }, this);
      
        return slotValues;
    },

    getSummary(data, ctx){
        var totaldelay = 0
        var response
        for (var x in data){
            totaldelay += data[x].delay
        }
        var trains = data.length
        var avg = totaldelay/trains
        if (avg == 0){
            response = ctx.t('NO_DELAY');
        } else if (0 < avg && avg < 10){
            response = ctx.t('MINOR_DELAY');
        } else if (10 < avg && avg < 60){
            response = ctx.t('DELAY');
        } else if (60 < avg){
            response = ctx.t('MAJOR_DELAY');
        } else {
            response = null
        }
        if(response != null) {
            response + '<break time="10s"/><break time="10s"/>';
        }
        return response;
    }
};

const Timetables = {
  getTimetable: async function (handlerInput) {
    let {
      requestEnvelope,
      attributesManager
    } = handlerInput;
    let sessionAttributes = attributesManager.getSessionAttributes();
    let ctx = attributesManager.getRequestAttributes();

    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = helpers.getSlotValues(filledSlots);

    var outputSpeech = "";
    console.log(slotValues.station.resolved);
    await helpers.getTrains(slotValues.station.resolved).then(response => {
        outputSpeech = helpers.getSummary(response, ctx);
        if(outputSpeech == null) {
            let responseMessage = ctx.t('NO_TRAINS');
            ctx.renderDefault(handlerInput, responseMessage);
        } else {
            ctx.renderTimetable(handlerInput, response);
        }
    }).catch(error => {
        logger.error('getTrains status:' + error);
        outputSpeech = ctx.t('API_CALL_ERROR');
    });
    ctx.outputSpeech.push(outputSpeech);
    ctx.openMicrophone = false;
  }
};
module.exports = Timetables;