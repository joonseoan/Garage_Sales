const { createProduct } = require('./mutations/createProduct');

module.exports = {
    hello: function(parentValue, args, req) {
        return 'Hello!!!'
    },
    createProduct
}