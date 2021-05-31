const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constans');

const getAll = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const { contacts, total, limit, page } = await Contacts.listContacts(
      userID,
      req.query
    );
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { total, limit, page, contacts },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const contact = await await Contacts.getContactById(
      userID,
      req.params.contactId
    );
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const contacts = await Contacts.addContact({ ...req.body, owner: userID });
    if (contacts) {
      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: {
          contacts,
        },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'missing required name field',
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const contact = await Contacts.removeContact(userID, req.params.contactId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
        message: 'contact deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const userID = req.user.id;
    if (Object.keys(req.body).length === 0) {
      return res.status(HttpCode.BAD_REQUEST).json({
        code: HttpCode.BAD_REQUEST,
        message: 'missing fields',
      });
    }

    const contact = await Contacts.updateContact(
      userID,
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    }
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
};

//router.patch(
//   '/:contactId/favorite',
//   favoriteContact,
//   async (req, res, next) => {
//     try {
//       if (Object.keys(req.body).length === 0) {
//         return res.status(400).json({
//           code: 400,
//           message: 'missing field favorite',
//         });
//       }

//       const contact = await Contacts.updateStatusContact(
//         req.params.contactId,
//         req.body
//       );
//       if (contact) {
//         return res.json({
//           status: 'success',
//           code: 200,
//           data: {
//             contact,
//           },
//         });
//       }
//       return res.status(404).json({
//         status: 'error',
//         code: 404,
//         message: 'Not found',
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );
