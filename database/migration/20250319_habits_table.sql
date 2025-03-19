-- Start transaction
BEGIN;

-- Modify the todo table by changing updated_at to allow NULL
ALTER TABLE todo 
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- Create the habits table
CREATE TABLE IF NOT EXISTS habits (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL,
    "description" VARCHAR(60) NOT NULL,
    "last_completed" TIMESTAMPTZ NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NULL,
    "streak" INTEGER DEFAULT 0
);

-- Commit transaction
COMMIT;