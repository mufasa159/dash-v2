import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
    user     : process.env.PG_USER || 'postgres',
    password : process.env.PG_PASSWORD || 'password',
    host     : process.env.PG_HOST || 'localhost',
    port     : parseInt(process.env.PG_PORT || '5432'),
    database : process.env.PG_DB || 'dash',
});


/**
 * Function to execute a SQL file
 * 
 * @param {string} filePath The path to the SQL file to execute
 * @returns {Promise<void>}
 */
async function executeSqlFile(filePath: string): Promise<void> {
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        const client = await pool.connect();

        try {
            await client.query(sql);
            console.log(`Successfully executed SQL file: ${filePath}`);
        } finally {
            client.release();
        }

    } catch (error) {
        console.error(`Error executing SQL file ${filePath}:`, error);
        throw error;
    }
}


/**
 * Function to execute all migration files in
 * the migrations directory
 * 
 * @param {string[]} executedMigrations List of already migrated files
 * @returns {Promise<void>}
 */
async function migrate(executedMigrations: string[]): Promise<void> {
    try {

        // the migration files are stored in
        // the `./database/migration` directory
        const migrationsDir = path.join(
            process.cwd(),
            'database',
            'migration'
        );

        // check if migrations directory exists
        if (!fs.existsSync(migrationsDir)) {
            console.warn('Migrations directory not found:', migrationsDir);
            return;
        }

        // get all SQL files and sort them by name,
        // which should already be date-prefixed
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // execute each migration file in order
        for (const file of migrationFiles) {
            if (!executedMigrations.includes(file)) {
                const filePath = path.join(migrationsDir, file);
                await executeSqlFile(filePath);
                await trackMigration(file);
                console.log(`Migration executed and tracked: ${file}`);

            } else {
                console.log(`Migration already executed (skipping): ${file}`);
            }
        }

    } catch (error) {
        console.error('Error executing migrations:', error);
        throw error;
    }
}


/**
 * Function to ensure the migrations table exists.
 * The table stores the names of all migrations that
 * have been executed.
 * 
 * @returns {Promise<void>}
 */
async function ensureMigrationsTable(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        client.release();
    }
}


/**
 * Tracks which migrations have been executed by
 * inserting the migration name into the migrations
 * table.
 * 
 * @param {string} name The name of the migration file
 * @returns {Promise<void>}
 */
async function trackMigration(name: string): Promise<void> {
    const client = await pool.connect();
    try {
        const q = `
            INSERT INTO migrations (name)
            VALUES ($1)
            ON CONFLICT (name)
            DO NOTHING;
        `;
        await client.query(q, [name]);
    } finally {
        client.release();
    }
}


/**
 * Get a list of all migrations that have been
 * executed for verification purposes.
 * 
 * @returns {Promise<string[]>}
 */
async function getExecutedMigrations(): Promise<string[]> {
    const client = await pool.connect();
    try {
        const q = `
            SELECT name
            FROM migrations
            ORDER BY name
        `;
        const result = await client.query(q);
        return result.rows.map(row => row.name);
    } finally {
        client.release();
    }
}


/**
 * Initialize the database by executing the main
 * schema file and all migrations that haven't been
 * executed yet.
 * 
 * @returns {Promise<void>}
 */
export async function initializeDB(): Promise<void> {
    try {

        // check migrations table exists
        await ensureMigrationsTable();

        // get list of executed migrations
        const executedMigrations = await getExecutedMigrations();

        // load and execute the main schema
        const schemaPath = path.join(
            process.cwd(),
            'database',
            'schema.sql'
        );

        if (fs.existsSync(schemaPath)) {
            await executeSqlFile(schemaPath);
        } else {
            console.warn('Schema file not found:', schemaPath);
        }

        // migrate new changes
        await migrate(executedMigrations
            .filter(file => file !== 'schema.sql'));

        console.log('Database initialization complete');

    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

initializeDB().catch(console.error);

export default pool;