const express = require('express');
const router = express.Router();
const contactsCtrl = require('../../../controllers/contacts');
const guard = require('../../../helpers/guard');
const {
  createContact,
  updateContact,
  favoriteContact,
} = require('./validatio');

router.get('/', guard, contactsCtrl.getAll);

router.get('/:contactId', guard, contactsCtrl.getById);

router.post('/', guard, createContact, contactsCtrl.create);

router.delete('/:contactId', guard, contactsCtrl.remove);

router.put('/:contactId', guard, updateContact, contactsCtrl.update);
router.patch(
  '/:contactId/favorite',
  guard,
  favoriteContact,
  contactsCtrl.update
);

module.exports = router;
