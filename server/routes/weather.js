const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/weatherController');

router.get('/', auth, c.getWeatherData);
router.get('/irrigation-advice', auth, c.getIrrigationAdvice);

module.exports = router;
