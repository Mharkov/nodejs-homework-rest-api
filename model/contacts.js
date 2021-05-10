const fs = require('fs/promises');
const db = require('./db');
const path = require('path');
const { v4: uuid } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const list = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(list);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactToFind = contacts.find((contact) => contact.id === contactId);
  return contactToFind;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newListContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  const contactToRemove = contacts.find((contact) => contact.id === contactId);

  await fs.writeFile(
    contactsPath,
    JSON.stringify(newListContacts, null, 2),
    'utf8'
  );

  return contactToRemove;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const id = uuid();
  const newContact = {
    id,
    ...body,
  };
  const newListContacts = [...contacts, newContact];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newListContacts, null, 2),
    'utf8'
  );
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  const newContact = { ...contact, ...body };

  const newListContacts = contacts.map((obj) =>
    obj.id === contactId ? newContact : obj
  );

  await fs.writeFile(
    contactsPath,
    JSON.stringify(newListContacts, null, 2),
    'utf8'
  );

  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
