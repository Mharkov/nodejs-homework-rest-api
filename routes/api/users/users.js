const express = require('express');
const router = express.Router();
const userCtrl = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const { validateUserReg, validateUserLogin } = require('./validatio');
const upload = require('../../../helpers/upload');

router.get('/verify/:verificationToken', userCtrl.verify);
router.post('/verify', userCtrl.repeatSendEmailVerify);

router.post('/signup', validateUserReg, userCtrl.signup);
router.post('/login', validateUserLogin, userCtrl.login);
router.post('/logout', guard, userCtrl.logout);
router.get('/current', guard, userCtrl.current);
router.patch('/', guard, userCtrl.update);

router.patch('/avatars', [guard, upload.single('avatar')], userCtrl.avatars);

module.exports = router;
