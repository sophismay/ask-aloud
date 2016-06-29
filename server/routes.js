/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {

  // All undefined asset or api routes should return a 404
  //app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  // .get(errors[404]);
  app.route('/:url(api|assets)/*')
   .get(errors[404])

  app.route('/rtc')
    .get((req, res) => { 
    res.sendFile(path.resolve(app.get('appPath') + '/rtc.html'))
    //res.render('pages/index')
  }) 

  app.route('/student')
    .get( (req, res) => {
      res.render('pages/student')
    })  

  app.route('/lecturer')
    .get( (req, res) => {
      res.render('pages/lecturer')
    })   

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      //res.sendFile(path.resolve(app.get('appPath') + '/rtc.html'));
      res.render('pages/index')
    })
}
