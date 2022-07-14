const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, price) {
        // get existing cart
        fs.readFile(p, (err, data) => {
            // init empty cart obj
            let cart = {products: [], totalPrice: 0};
            if(!err) {
                cart = JSON.parse(data);
            }

            // find existing product with passed ID
            const existingProductInd = cart.products.findIndex(pp => pp.id === id);
            const existingProduct = cart.products[existingProductInd];
            let updatedProduct;

            if(existingProduct) {
                // immutable objects & arrays: copy & reassign
                updatedProduct = {...existingProduct};
                updatedProduct.qty = existingProduct.qty + 1;
                // not sure why this is done
                cart.products = [...cart.products];
                cart.products[existingProductInd] = updatedProduct;
            }
            else {
                // add a product with this ID (db lookup for product data)
                updatedProduct = {id: id, qty: 1};
                // add new item to cart full of other items (other IDs)
                cart.products = [...cart.products, updatedProduct];
            }
            // update cart total
            // ES6 unary operator forces Number
            cart.totalPrice += +price;

            fs.writeFile(p, JSON.stringify(cart), err => console.log(err) );
        });
    }
}