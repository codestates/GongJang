const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "port": process.env.DATABASE_PORT,
    "timezone": "+09:00",
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.DATABASE_USER_TEST,
    "password": process.env.DATABASE_PASSWORD_TEST,
    "database": process.env.DATABASE_NAME_TEST,
    "host": process.env.DATABASE_HOST_TEST,
    "port": process.env.DATABASE_PORT_TEST,
    "timezone": "+09:00",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    "port": process.env.DATABASE_PORT,
    "timezone": "+09:00",
    "dialect": "mysql"
  }
}