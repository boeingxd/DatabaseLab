-- =====================================================================
-- Assignment 11 - Q6 and Q7 : JSON column and JSON queries (Workbench)
-- =====================================================================
USE bookstore_lab11;

-- ---------- Q6: JSON column (1.5 points) ----------
ALTER TABLE books ADD COLUMN attributes JSON;

UPDATE books SET attributes = JSON_OBJECT('format','hardcover','pages',1376) WHERE id = 1;
UPDATE books SET attributes = JSON_OBJECT('format','paperback','pages',380)  WHERE id = 2;
UPDATE books SET attributes = JSON_OBJECT('format','paperback','pages',660)  WHERE id = 3;
UPDATE books SET attributes = JSON_OBJECT('format','hardcover','pages',464)  WHERE id = 4;
UPDATE books SET attributes = JSON_OBJECT('format','ebook','pages',472)      WHERE id = 5;
UPDATE books SET attributes = JSON_OBJECT('format','ebook','pages',616)      WHERE id = 6;

SELECT id, title, attributes FROM books;

-- ---------- Q7: query JSON (1.5 points, SQL part) ----------
-- every book's title with its format
SELECT title, attributes->>'$.format' AS format FROM books;

-- only the ebooks
SELECT id, title, attributes->>'$.pages' AS pages
  FROM books
 WHERE attributes->>'$.format' = 'ebook';
