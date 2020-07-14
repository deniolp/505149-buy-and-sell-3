DROP ROLE IF EXISTS buy_sell;
DROP DATABASE IF EXISTS buy_and_sell;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS offers;

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

CREATE TABLE users
(
    id bigserial NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(50) UNIQUE NOT NULL,
    password character varying(50) NOT NULL,
    avatar character varying(50),
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX email_index ON users ((lower(email)));
CREATE TYPE offer_type AS ENUM ('buy', 'offer');

CREATE TABLE offers
(
    id bigserial NOT NULL,
    type offer_type NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(1000) NOT NULL,
    sum numeric NOT NULL,
    picture character varying(500),
    created_date DATE NOT NULL,
    user_id bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT offers_users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX title_index ON offers ((lower(title)));

CREATE TABLE categories
(
    id bigserial PRIMARY KEY,
    title character varying(50) NOT NULL,
    picture character varying(500)
);

CREATE TABLE comments
(
    id bigserial PRIMARY KEY,
    text character varying(300) NOT NULL,
    created_date DATE NOT NULL,
    user_id bigint NOT NULL,
    offer_id bigint NOT NULL,
    CONSTRAINT comments_users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT comments_offers FOREIGN KEY (offer_id)
        REFERENCES offers (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE offers_categories
(
    offer_id bigint NOT NULL,
    category_id bigint NOT NULL,
    CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id),
    FOREIGN KEY(offer_id) REFERENCES offers (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY(category_id) REFERENCES categories (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
