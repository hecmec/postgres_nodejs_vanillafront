
const dbConfig_dev = {
  host: 'localhost',
  port: 5432,
  database: 'babyfoot',
  user: 'babyfoot_user',
  password: 'toto123',
};

const dbConfig_test = {
  host: 'localhost',
  port: 5432,
  database: 'babyfoot_test',
  user: 'babyfoot_user',
  password: 'toto123',
};

const dbConfig_prod = {
  host: 'localhost',
  port: 5432,
  database: 'babyfoot_prod',
  user: 'babyfoot_user',
  password: 'toto123',
};

let config = {
  dbConfigTest: dbConfig_test,
  dbConfig: process.env.NODE_ENV === 'Production' ? dbConfig_prod : dbConfig_dev

  
}

module.exports = config;