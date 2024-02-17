CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
  ('John Doe', 'https://example.com/blog1', 'Introduction to SQL', 10),
  ('Jane Smith', 'https://example.com/blog2', 'Advanced Database Concepts', 15);