import dotenv from 'dotenv';

import {Sequelize} from 'sequelize';

const ENV = dotenv.config().parsed;

const connection = new Sequelize(
    ENV.DB_NAME,
    ENV.DB_USER,
    ENV.DB_PASSWORD,
    {
        host: ENV.DB_HOST,
        dialect: ENV.DB_DIALECT
    }
);

export default connection;