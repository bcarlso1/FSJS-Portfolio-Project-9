'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successful connection to the database");

    // sync models
    // console.log('sync models with database');
    // await sequelize.sync({ force: true });

    // retrieve courses
    // const users = await User.findAll({
    //   include: [
    //     {
    //       model: Course,
    //     },
    //   ],
    // });


  } catch (error) {
    console.error("Error connecting to database", error)
  }
})();
