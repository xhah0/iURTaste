const express = require('express');
const router = express.Router();
const { signup, login, getLoyaltyPoints} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { updateProfile } = require('../controllers/authController');



router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});
router.put('/update-profile', protect, updateProfile);

const { googleLogin } = require('../controllers/authController');

router.post('/google-login', googleLogin);


router.get('/loyalty-points', protect, getLoyaltyPoints);


module.exports = router;


