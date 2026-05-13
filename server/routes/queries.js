const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const c = require('../controllers/queryController');

router.get('/', auth, c.getConversations);
router.get('/stats', auth, c.getStats);
router.post('/', auth, c.createConversation);
router.get('/:id', auth, c.getConversation);
router.post('/:id/message', auth, aiLimiter, c.sendMessage);
router.delete('/:id', auth, c.deleteConversation);

module.exports = router;
