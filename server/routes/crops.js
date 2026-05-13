const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/cropController');

router.get('/', auth, c.getCrops);
router.post('/', auth, c.createCrop);
router.get('/:id', auth, c.getCrop);
router.put('/:id', auth, c.updateCrop);
router.patch('/:id/stage', auth, c.updateStage);
router.delete('/:id', auth, c.deleteCrop);

module.exports = router;
