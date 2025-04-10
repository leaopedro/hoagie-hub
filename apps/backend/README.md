# HoagieClub Backend

A sandwich recipe creation platform built with **NestJS** and **MongoDB**.

---

## Tech Stack

- Backend: [NestJS](https://nestjs.com/)
- DB: [MongoDB](https://www.mongodb.com/)

---

## Getting Started

### 1. Install dependencies

```bash
npm i
```

### 2. Run MongoDB via Docker

```bash
docker-compose up -d
```

> db will be available at port `27017`.

### 3. Start

```bash
npm run start
```

---

## Authentication

This app has a mock auth feature via header:

```
x-user-id: <MongoDB ObjectId of a user>
```

Use `POST /auth/signup` to create a user and grab the ID for use in other requests.

---

## API Endpoints

### Auth

#### `POST /auth/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### `POST /auth/login`

```json
{
  "email": "john@example.com"
}
```

---

### Hoagies _(Requires `x-user-id` header)_

#### `POST /hoagies` 

```json
{
  "name": "Beef Blaster",
  "ingredients": ["roast beef", "cheddar", "mayo"],
  "image": "https://example.com/image.png"
}
```

#### `GET /hoagies?limit=5&offset=0`

Returns list of hoagies with populated `creator` and `commentCount`.

#### `GET /hoagies/:id`

Returns single hoagie with `creator` + `commentCount`.

---

### Comments _(Requires `x-user-id` header)_

#### `POST /comments`

```json
{
  "hoagieId": "<hoagie object_id>",
  "text": "This one is good"
}
```

#### `GET /hoagies/:id/comments`

Returns comments for a hoagie, with user name/email/id populated.

---

## MongoDB Data Model
Here's how the core data is structured in Hoagie Hub:

### User
Each user has:

- `name`: their display name

- `email`: used for login (mocked, no passwords)

### Hoagie
Every hoagie (sandwich recipe) includes:

- `name`: the title of the hoagie

- `ingredients`: a list of strings like "cheddar", "lettuce"

- `image` (optional): a URL to an image of the hoagie

- `creator`: a reference to the user who created it

###  Comment
Users can comment on any hoagie. Each comment includes:

- `text`: the content of the comment

- `user`: the person who posted it (referenced from User)

- `hoagie`: the hoagie this comment belongs to

---

## Bonus

- [x] Populated `creator` in hoagie response
- [x] Aggregated `commentCount` per hoagie
- [x] Pagination with DTO validation

