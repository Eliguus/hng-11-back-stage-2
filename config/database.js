const { Sequelize } = require("sequelize");


const sequelize = new Sequelize('postgresql://stagetwo_zf3u_user:Orr8G2qJUKcOkwijK0QxJmwFTCqOPpgq@dpg-cq4r0umehbks73bg4ql0-a.oregon-postgres.render.com/stagetwo_zf3u', {
	dialect: "postgres",
    protocol: 'postgres',
	logging: false,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Note: setting this to false is not recommended for production
        }
      }
});

module.exports = sequelize;