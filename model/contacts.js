const Contacts = require('./schema/contact-schema');

const listContacts = async () => {
  const results = await Contacts.find({});
  return results;
};

const getContactById = async (contactId) => {
  const results = await Contacts.findOne({ _id: contactId });
  return results;
};

const removeContact = async (contactId) => {
  const results = await Contacts.findByIdAndRemove({ _id: contactId });
  return results;
};

const addContact = async (body) => {
  const results = await Contacts.create(body);
  return results;
};

const updateContact = async (contactId, body) => {
  const results = await Contacts.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
  return results;
};
const updateStatusContact = async (contactId, body) => {
  const results = await Contacts.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
  return results;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
