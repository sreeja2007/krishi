const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/marketController');

router.get('/', auth, c.getPrices);
router.get('/latest', auth, c.getLatestPrices);
router.post('/', auth, c.createPrice);

module.exports = router;
