# CSE412-Semester-Project

This project is a full-stack boilerplate using a React frontend, an Express/Node backend, and a PostgreSQL database.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (ensure your database is running and credentials are available)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/CSE412-Semester-Project.git
cd CSE412-Semester-Project
```

---

### 2. Set Up the Backend

```sh
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory with your PostgreSQL credentials:

```
PGUSER=your_db_username
PGPASSWORD=your_db_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=your_db_name
```

#### Start the Backend Server

```sh
npm start
```

The backend will run on [http://localhost:5052](http://localhost:5052).

---

### 3. Set Up the Frontend

Open a new terminal window/tab:

```sh
cd frontend
npm install
npm start
```

The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Usage

- The React frontend runs on port 3000.
- The Express backend runs on port 5052 and connects to your PostgreSQL database.
- Example backend test endpoint: [http://localhost:5052/test-db](http://localhost:5052/test-db)

---

## Project Structure

```
CSE412-Semester-Project/
  backend/
    server.js
    db.js
    package.json
    .env
  frontend/
    src/
    package.json
  README.md
```

---

## Troubleshooting

- Ensure PostgreSQL is running and accessible with the credentials in your `.env` file.
- If ports 3000 or 5052 are in use, update them in the respective configuration files.
- For CORS issues, ensure the backend uses the `cors` middleware.

---

## License

This project is for educational purposes. Update this section as needed.