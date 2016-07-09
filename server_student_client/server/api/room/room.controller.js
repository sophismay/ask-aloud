'use strict';

import _ from 'lodash';
import Room from './room.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Rooms
export function index(req, res) {
  return Room.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
