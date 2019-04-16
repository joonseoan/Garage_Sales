const { createProduct } = require('./mutations/createProduct');
const { createContact } = require('./mutations/createContact');
const { signup, logout, login } = require('./mutations/auth');
const { getCurrentUser } = require('./queries/getCurrentUser');
const { getCoords } = require('./queries/getCoords');
const { getImageList } = require('./queries/getImageList');

module.exports = { 
    createProduct,
    createContact,
    signup,
    logout,
    login,
    getImageList,
    getCurrentUser,
    getCoords,
}