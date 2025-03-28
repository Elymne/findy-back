const jobQuery = `
    CREATE TABLE IF NOT EXISTS job(
        id VARCHAR(250) UNIQUE NOT NULL,
        title VARCHAR(250) UNIQUE NOT NULL,
        CONSTRAINT pk_job PRIMARY KEY (id)
    );
`

const zoneQuery = `
    CREATE TABLE IF NOT EXISTS zone (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        lat FLOAT NOT NULL,
        lng FLOAT NOT NULL,
        CONSTRAINT pk_zone PRIMARY KEY (id)
    );
`

const companyQuery = `
    CREATE TABLE IF NOT EXISTS company (
        id VARCHAR(250) UNIQUE NOT NULL,
        name VARCHAR(250) UNIQUE NOT NULL,
        description LONGTEXT,
        url VARCHAR(250),
        logo_url VARCHAR(250),
        CONSTRAINT pk_company PRIMARY KEY (id)
    );
`

const queryCheck = jobQuery + zoneQuery + companyQuery
export default queryCheck
