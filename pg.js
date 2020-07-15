'use strict';

const {Pool} = require(`pg`);

const pool = new Pool({
  host: `localhost`,
  port: 5432,
  database: `buy_and_sell`,
  user: `buy_sell`,
  password: ``
});

(async () => {
  const fields = [`schemaname`, `tablename`, `tableowner`].join(`, `);
  const sql = `SELECT ${fields} FROM pg_tables WHERE tableowner = $1`;
  const {rows} = await pool.query(sql, [`buy_sell`]);

  console.table(rows);
  pool.end();
})();
