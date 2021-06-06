const express = require('express');
const router = express.Router();
const userCtrl = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const { validateUserReg, validateUserLogin } = require('./validatio');

router.post('/signup', validateUserReg, userCtrl.signup);
router.post('/login', validateUserLogin, userCtrl.login);
router.post('/logout', guard, userCtrl.logout);
router.get('/current', guard, userCtrl.current);
router.patch('/', guard, userCtrl.update);

module.exports = router;
