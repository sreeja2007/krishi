const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const c = require('../controllers/alertController');

// Static routes MUST come before /:id to avoid being swallowed by the param route
router.get('/', auth, c.getAlerts);
router.get('/unread-count', auth, c.getUnreadCount);
router.patch('/mark-all-read', auth, c.markAllRead);
router.patch('/:id/read', auth, c.markRead);
router.delete('/:id', auth, c.deleteAlert);

module.exports = router;
