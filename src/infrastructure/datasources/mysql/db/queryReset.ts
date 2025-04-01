const jobQuery = `
    CREATE OR REPLACE TABLE job(
        id VARCHAR(250) UNIQUE NOT NULL,
        title VARCHAR(250) UNIQUE NOT NULL,

        CONSTRAINT pk_job PRIMARY KEY (id)
    );
`

const zoneQuery = `
    CREATE OR REPLACE TABLE zone (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        lat FLOAT NOT NULL,
        lng FLOAT NOT NULL,

        CONSTRAINT pk_zone PRIMARY KEY (id)
    );
`

const companyQuery = `
    CREATE OR REPLACE TABLE company (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        description LONGTEXT,
        url VARCHAR(250),
        logoUrl VARCHAR(250),
        
        CONSTRAINT pk_company PRIMARY KEY (id)
    );
`

const offerQuery = `
    CREATE OR REPLACE TABLE offer (
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

const queryCheck = jobQuery + zoneQuery + companyQuery + offerQuery
export default queryCheck
