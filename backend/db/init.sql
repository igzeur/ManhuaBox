-- backend/db/init.sql

CREATE TABLE IF NOT EXISTS works (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    type VARCHAR(50), -- ex: 'Manga', 'Roman', 'BD'
    image_url TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
    id SERIAL PRIMARY KEY,
    work_id INTEGER NOT NULL REFERENCES works(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE, -- Nouvelle colonne pour l'encoche de validation
    personal_note_text TEXT,
    personal_note_rating INTEGER CHECK (personal_note_rating >= 1 AND personal_note_rating <= 5), -- Note de 1 à 5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (work_id, chapter_number) -- Un chapitre unique par oeuvre et numéro
);

-- Index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_works_title ON works(title);
CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON chapters(work_id);
