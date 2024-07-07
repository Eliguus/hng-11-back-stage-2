const { Sequelize } = require('sequelize');

const db = new Sequelize('postgresql://stagetwo_zf3u_user:Orr8G2qJUKcOkwijK0QxJmwFTCqOPpgq@dpg-cq4r0umehbks73bg4ql0-a.oregon-postgres.render.com/stagetwo_zf3u', {
  dialect: 'postgres',
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true
    }
  },
  logging: false
});


async function dbConn() {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await db.sync();
    console.log('Models synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { dbConn, db };