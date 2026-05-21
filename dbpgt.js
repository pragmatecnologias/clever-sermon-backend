
const pg = require('pg');
const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin123',
  database: 'clever_sermon'
});
async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM egw_scripture_references');
    console.log('COUNT:', res.rows[0].count);
    await client.end();
  } catch(e) {
    console.log('ERROR:', e.message);
  }
}
test();
