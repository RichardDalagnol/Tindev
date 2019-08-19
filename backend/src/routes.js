const express = require('express');
const DevControler = require('./controllers/DevControler');
const LikeController = require('./controllers/LikeController');
const DisLikeController = require('./controllers/DisLikeController');

const routes = express.Router();

routes.post('/devs', DevControler.store);
routes.get('/devs', DevControler.index);

routes.post('/devs/:DevId/like', LikeController.store);
routes.post('/devs/:DevId/dislike', DisLikeController.store);

module.exports = routes;