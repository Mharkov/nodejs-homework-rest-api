const fs = require('fs/promises');
const db = require('./db');
const path = require('path');
const { v4: uuid } = require('uuid');
// const contacts = require('./contacts.json');

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
    String(obj.id) === contactId ? newContact : obj
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

// {
//     "id": "9486ae96-f832-457d-8ec1-74b583a21ed5",
//     "name": "Allen Raymonda",
//     "email": "nulla.antea@vestibul.co.uk",
//     "phone": "(992) 914-3792"
//   }
