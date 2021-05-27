const Contacts = require('./schema/contact-schema');

const listContacts = async (userID, query) => {
  const {
    limit = 5,
    offset = 0,
    page = 1,
    sortBy,
    sortByDec,
    filter, // name | age| favorite
    favorite = null,
  } = query;

  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const results = await Contacts.paginate(optionsSearch, {
    limit,
    offset,
    page,
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
  });
  const { docs: contacts, totalDocs: total } = results;
  return { contacts, total, limit, page };
};

const getContactById = async (userID, contactId) => {
  const results = await Contacts.findOne({
    _id: contactId,
    owner: userID,
  }).populate({ path: 'owner', select: 'namr email subscription -_id' });
  return results;
};

const removeContact = async (userID, contactId) => {
  const results = await Contacts.findByIdAndRemove({
    _id: contactId,
    owner: userID,
  });
  return results;
};

const addContact = async (body) => {
  const results = await Contacts.create(body);
  return results;
};

const updateContact = async (userID, contactId, body) => {
  const results = await Contacts.findOneAndUpdate(
    { _id: contactId, owner: userID },
    { ...body },
    { new: true }
  );
  return results;
};
const updateStatusContact = async (userID, contactId, body) => {
  const results = await Contacts.findOneAndUpdate(
    { _id: contactId, owner: userID },
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
