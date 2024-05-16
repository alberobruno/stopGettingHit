import 'dotenv/config';
import { Pool } from 'pg';

const PG_URI = process.env.DATABASE_URL;

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database

export const query = async (text: string, params?: unknown[]) => {
  console.log(
    'Executing query:',
    text.length < 100 ? text : text.substring(0, 100) + '......etc'
  );
  try {
    const result = await pool.query(text, params);
    console.log(`Query successful: ${result.rows.length} matches found`);
    return result;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  }
};
