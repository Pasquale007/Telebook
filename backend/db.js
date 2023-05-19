import mysql from 'mysql';

const connectionData = {
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'APP'
};

export const createConnection = () => {
  return mysql.createConnection(connectionData);
}

