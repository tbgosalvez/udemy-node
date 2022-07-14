// path: ./models/

const db = require('../util/db');

module.exports = class Product {
  constructor(id, title, imageUrl, desc, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this.price = price;
  }

  // using MySql
  save() {
    return db.execute('insert into products (title, price, desc, imageUrl) values(?, ?, ?, ?)',
      [this.title,this.price,this.desc,this.imageUrl]);
  }

  static fetchAll() {
    return db.execute('select * from products');
  }

  static findById(id) {
    return db.execute('select * from products where id=?',[id]);
  }

  static deleteById(id) {
    return db.execute('delete from products where id=?', [id]);
  }
};
