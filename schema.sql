/* There are initial commands under postgres user*/
DROP DATABASE IF EXISTS buy_and_sell;
DROP ROLE IF EXISTS buy_sell;

CREATE ROLE buy_sell WITH
    LOGIN
    NOSUPERUSER
    CREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD '';

CREATE DATABASE buy_and_sell
    WITH
    OWNER = buy_sell
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1;

CREATE DATABASE test_buy_and_sell
    WITH
    OWNER = buy_sell
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1;

/* There are commands under buy_sell user*/
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS offer_type;

CREATE TABLE users
(
    id bigserial NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) UNIQUE NOT NULL,
    "passwordHash" character varying(100) NOT NULL CHECK (char_length("passwordHash") > 6),
    avatar character varying(50),
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX email_index ON users ((lower(email)));
CREATE TYPE offer_type AS ENUM ('buy', 'offer');
SET datestyle = "ISO, DMY";

CREATE TABLE offers
(
    id bigserial NOT NULL,
    type offer_type NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(1000) NOT NULL,
    sum numeric NOT NULL,
    picture character varying(500),
    created_date DATE NOT NULL,
    "userId" bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT offers_users FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX title_index ON offers ((lower(title)));
CREATE INDEX offer_created_date_index ON offers (created_date);

CREATE TABLE categories
(
    id bigserial NOT NULL,
    title character varying(50) NOT NULL,
    picture character varying(500),
    PRIMARY KEY (id)
);

CREATE TABLE comments
(
    id bigserial NOT NULL,
    text character varying(300) NOT NULL,
    created_date DATE NOT NULL,
    "userId" bigint NOT NULL,
    "offerId" bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT comments_users FOREIGN KEY ("userId")
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT comments_offers FOREIGN KEY ("offerId")
        REFERENCES offers (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX user_id_index ON comments ("userId");
CREATE INDEX offer_id_index ON comments ("offerId");
CREATE INDEX comment_created_date_index ON comments (created_date);

CREATE TABLE offers_categories
(
    "offerId" bigint NOT NULL,
    "categoryId" bigint NOT NULL,
    CONSTRAINT offers_categories_pk PRIMARY KEY ("offerId", "categoryId"),
    FOREIGN KEY("offerId") REFERENCES offers (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY("categoryId") REFERENCES categories (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
