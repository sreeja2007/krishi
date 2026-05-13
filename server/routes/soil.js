const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/soilController');

router.get('/', auth, c.getReports);
router.get('/latest', auth, c.getLatestReport);
router.post('/', auth, c.createReport);
router.delete('/:id', auth, c.deleteReport);

module.exports = router;
