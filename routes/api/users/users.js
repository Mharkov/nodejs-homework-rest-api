const express = require('express');
const router = express.Router();
const userCtrl = require('../../../controllers/users');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);
router.get('/current', userCtrl.current);

module.exports = router;
