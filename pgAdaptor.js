require('dotenv').config();
const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const config = {
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  ssl: true,
};

const db = pgp(
  process.env.NODE_ENV === 'test'
    ? 'postgres://localhost/testroundhouse'
    : config,
);

exports.db = db;
