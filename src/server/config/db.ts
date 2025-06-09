import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as any) || 'mysql', // Ideally cast to SequelizeDialect
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced successfully.');
    }
  } catch (error) {
    // TS fix: assert 'error' is of type Error
    if (error instanceof Error) {
      console.error('❌ Unable to connect to the database:', error.message);
    } else {
      console.error('❌ An unknown error occurred while connecting to the database.');
    }
    process.exit(1);
  }
};

export default sequelize;
