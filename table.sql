CREATE TABLE "session"
(
  "sid" varchar NOT NULL
  COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp
  (6) NOT NULL
)
  WITH
  (OIDS=FALSE);

  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
  NOT DEFERRABLE INITIALLY IMMEDIATE;

  CREATE INDEX "IDX_session_expire" ON "session" ("expire");

  CREATE USER root
  WITH password 'root';

  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO root;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO root;

  ALTER USER root WITH SUPERUSER 

  -- for connecting to postgres
  -- local
  --/Applications/Postgres.app/Contents/Versions/12/bin/psql -U root -d atom_fashion_dev
  --prod -- don't forget to whitelist current ip address
  --/Applications/Postgres.app/Contents/Versions/12/bin/psql -U postgres -d atom_fashion -h 34.84.65.32

