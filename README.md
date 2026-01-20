# URL Shortener with Redis

A simple URL shortener service built with TypeScript, Express, and Redis. This project allows you to shorten URLs and redirect to the original URLs. Shortened URLs expire after 60 seconds.

## Features

- Shorten long URLs into compact, random strings
- Automatic redirection from short URLs to original URLs
- URLs expire after 60 seconds for temporary use
- Built with TypeScript for type safety
- Uses Redis for fast, in-memory storage

## Usage

### Running the Server

To start the server, run:
```bash
npx tsc && node dist/server.js
```

The server will start on `http://localhost:3000`.

### API Endpoints

#### Shorten a URL
- **Endpoint**: `POST /`
- **Body**: JSON object with `url` field
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response**: JSON with `shortUrl`
  ```json
  {
    "shortUrl": "AbCdEfGhIjKl"
  }
  ```

#### Redirect to Original URL
- **Endpoint**: `GET /:shortUrl`
- **Example**: `GET /AbCdEfGhIjKl`
- **Response**: Redirects to the original URL or returns 404 if not found

## Configuration

- **Port**: The server runs on port 3000 by default (configurable in `src/server.ts`)
- **Expiration**: URLs expire after 60 seconds (configurable via `WINDOW_SECONDS` in `src/server.ts`)
- **Redis**: Connects to local Redis on default port 6379

## Development

- **TypeScript**: Compile and run with `npx tsc`
- **Linting**: No linter configured yet
- **Testing**: No tests implemented yet
