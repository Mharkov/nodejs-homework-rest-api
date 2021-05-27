const express = require('express');
const router = express.Router();
const userCtrl = require('../../../controllers/users');
const guard = require('../../../helpers/guard');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.post('/logout', guard, userCtrl.logout);
router.get('/current', guard, userCtrl.current);

module.exports = router;
