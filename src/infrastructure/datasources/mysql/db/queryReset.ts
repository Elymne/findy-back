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

const queryCheck = jobQuery + zoneQuery + companyQuery
export default queryCheck
