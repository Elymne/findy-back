import { v4 as uuidv4 } from "uuid"
import { TextFilter } from "~/domain/entities/databases/textFilter.entity"

export const createTextFilterTableQuery = `
CREATE TABLE IF NOT EXISTS public.text_filter
(
    id uuid NOT NULL,
    value "char"[] NOT NULL,
    PRIMARY KEY (id)
);`
