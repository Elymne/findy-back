export const createSchoolTableQuery = `CREATE TABLE IF NOT EXISTS public.school
(
    id uuid NOT NULL,
    name "char"[] NOT NULL,
    PRIMARY KEY (id)
);`
