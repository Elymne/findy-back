export const createNoExistsJob = `
    CREATE TABLE IF NOT EXISTS job(
        id VARCHAR(250) UNIQUE NOT NULL,
        title VARCHAR(250) UNIQUE NOT NULL,

        CONSTRAINT pk_job PRIMARY KEY (id)
    );
`

export const createNoExistsZone = `
    CREATE TABLE IF NOT EXISTS zone (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        lat FLOAT NOT NULL,
        lng FLOAT NOT NULL,

        CONSTRAINT pk_zone PRIMARY KEY (id)
    );
`

export const createNoExistsCompany = `
    CREATE TABLE IF NOT EXISTS company (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        description LONGTEXT,
        url VARCHAR(250),
        logo_url VARCHAR(250),
        
        CONSTRAINT pk_company PRIMARY KEY (id)
    );
`

export const createNoExistsOffer = `
    CREATE TABLE IF NOT EXISTS offer (
        id VARCHAR(250) UNIQUE NOT NULL,
        title VARCHAR(250) UNIQUE NOT NULL,
        img_url VARCHAR(250),

        tags JSON NOT NULL,

        company_id VARCHAR(250) NOT NULL,
        zone_id VARCHAR(250) NOT NULL,
        job_id VARCHAR(250) NOT NULL,

        created_at DATETIME NOT NULL
        update_at DATETIME,

        origin TINYINT NOT NULL,
        origin_url VARCHAR(250),

        CONSTRAINT pk_offer PRIMARY KEY (id),
        CONSTRAINT fk_offer_company FOREIGN KEY (company_id) REFERENCES company(id),
        CONSTRAINT fk_offer_zone FOREIGN KEY (zone_id) REFERENCES zone(id),
        CONSTRAINT fk_offer_job FOREIGN KEY (job_id) REFERENCES job(id)
    );
`
