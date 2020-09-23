import { getConnection, DatabaseConnection } from '../src/DbConnection';

export const getDatabase = (): DatabaseConnection =>
  getConnection({
    user: 'postgres',
    host: 'localhost',
    database: 'profile_db_test',
    password: 'postgres',
    port: 5432,
  });
