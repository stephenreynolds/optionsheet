----------------
-- Extensions --
----------------

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-------------------
-- Create tables --
-------------------

CREATE TABLE IF NOT EXISTS app_user
(
    uuid                     UUID         NOT NULL PRIMARY KEY,
    username                 VARCHAR(255) NOT NULL UNIQUE,
    email                    VARCHAR(255) NOT NULL UNIQUE,
    email_confirmed          BOOLEAN      NOT NULL DEFAULT FALSE,
    password_hash            VARCHAR(60)  NOT NULL,
    avatar_url               TEXT,
    bio                      TEXT,
    pinned_projects          INTEGER[]             DEFAULT '{}',
    created_on               TIMESTAMPTZ  NOT NULL DEFAULT current_timestamp,
    updated_on               TIMESTAMPTZ           DEFAULT current_timestamp CHECK (updated_on >= app_user.created_on),
    refresh_token            VARCHAR(36),
    refresh_token_expiry     TIMESTAMPTZ,
    default_starting_balance NUMERIC,
    default_risk             NUMERIC
);

CREATE TABLE IF NOT EXISTS role
(
    id   INTEGER     NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_role
(
    user_id uuid    NOT NULL,
    role_id INTEGER NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES app_user (uuid) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project
(
    id               INTEGER      NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    starting_balance NUMERIC,
    risk             NUMERIC,
    created_on       TIMESTAMPTZ  NOT NULL DEFAULT current_timestamp,
    updated_on       TIMESTAMPTZ           DEFAULT current_timestamp CHECK (updated_on >= project.created_on),
    user_uuid        UUID         NOT NULL,

    CONSTRAINT fk_user FOREIGN KEY (user_uuid) REFERENCES app_user (uuid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS starred_project
(
    project_id INTEGER NOT NULL,
    user_uuid  uuid    NOT NULL,

    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_uuid) REFERENCES app_user (uuid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trade
(
    id           INTEGER     NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    symbol       VARCHAR(15) NOT NULL,
    open_date    TIMESTAMPTZ NOT NULL,
    close_date   TIMESTAMPTZ CHECK (close_date >= trade.open_date),
    opening_note TEXT,
    closing_note TEXT,
    created_on   TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,
    updated_on   TIMESTAMPTZ          DEFAULT current_timestamp CHECK (updated_on >= trade.created_on),
    project_id   INTEGER     NOT NULL,

    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
);

DO
$$
    BEGIN
        CREATE TYPE side AS ENUM ('Buy', 'Sell');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END
$$;

DO
$$
    BEGIN
        CREATE TYPE put_call AS ENUM ('Put', 'Call');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END
$$;

CREATE TABLE IF NOT EXISTS leg
(
    id          INTEGER        NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    side        side           NOT NULL,
    quantity    INTEGER        NOT NULL,
    open_price  NUMERIC(10, 2) NOT NULL,
    close_price NUMERIC(10, 2),
    put_call    put_call,
    expiration  Date,
    strike      NUMERIC(10, 2),
    trade_id    INTEGER        NOT NULL,

    CONSTRAINT fk_trade FOREIGN KEY (trade_id) REFERENCES trade (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tag
(
    id   INTEGER     NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_tag
(
    project_id INTEGER NOT NULL,
    tag_id     INTEGER NOT NULL,

    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE IF NOT EXISTS trade_tag
(
    trade_id INTEGER NOT NULL,
    tag_id   INTEGER NOT NULL,

    CONSTRAINT fk_trade FOREIGN KEY (trade_id) REFERENCES trade (id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE,
    PRIMARY KEY (trade_id, tag_id)
);

--------------
-- Triggers --
--------------
-- On user updated
CREATE OR REPLACE FUNCTION user_updated_on() RETURNS TRIGGER AS
$update_user$
BEGIN
    IF pg_trigger_depth() < 2 THEN
        UPDATE app_user
        SET updated_on = now()
        WHERE uuid = NEW.uuid;
    END IF;
    RETURN NEW;
END
$update_user$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_updated ON "optionsheet"."app_user";

CREATE TRIGGER on_user_updated
    AFTER UPDATE
    ON app_user
EXECUTE PROCEDURE user_updated_on();

-- On project updated
CREATE OR REPLACE FUNCTION project_updated_on() RETURNS TRIGGER AS
$update_project_and_user$
BEGIN
    IF pg_trigger_depth() < 2 THEN
        UPDATE project
        SET updated_on = now()
        WHERE id = NEW.id;

        UPDATE app_user
        SET updated_on = now()
        WHERE uuid = (
            SELECT user_uuid
            FROM project
            WHERE id = NEW.id);
    END IF;
    RETURN NEW;
END
$update_project_and_user$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_project_updated ON "optionsheet"."project";

CREATE TRIGGER on_project_updated
    AFTER UPDATE
    ON project
EXECUTE PROCEDURE project_updated_on();

-- On trade updated
CREATE OR REPLACE FUNCTION trade_updated_on() RETURNS TRIGGER AS
$update_user$
BEGIN
    IF pg_trigger_depth() < 2 THEN
        UPDATE trade
        SET updated_on = now()
        WHERE id = NEW.id;

        UPDATE project
        SET updated_on = now()
        WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
END
$update_user$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_trade_updated ON "optionsheet"."trade";

CREATE TRIGGER on_trade_updated
    AFTER UPDATE
    ON trade
EXECUTE PROCEDURE trade_updated_on();

-- On leg updated
CREATE OR REPLACE FUNCTION leg_updated_on() RETURNS TRIGGER AS
$update_user$
BEGIN
    IF pg_trigger_depth() < 2 THEN
        UPDATE project
        SET updated_on = now()
        WHERE id = (SELECT project_id
                    FROM trade
                    WHERE id = NEW.trade_id);

        UPDATE trade
        SET updated_on = now()
        WHERE id = NEW.trade_id;
    END IF;
    RETURN NEW;
END
$update_user$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_leg_updated ON "optionsheet"."leg";

CREATE TRIGGER on_leg_updated
    AFTER UPDATE
    ON leg
EXECUTE PROCEDURE leg_updated_on();

-- Insert default data
INSERT INTO role(name)
VALUES ('user')
ON CONFLICT DO NOTHING;