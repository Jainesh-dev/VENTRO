# VENTRO

### Discover opportunities. Build your career. Stay organized.

VENTRO is a career and internship discovery platform designed to help
students find relevant opportunities and keep their applications
organized in one place. It brings internship discovery, search and
filtering, saved opportunities, and application tracking into a single
experience.

> **Project status:** In active development.

## Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech stack](#tech-stack)
-   [Project structure](#project-structure)
-   [Getting started](#getting-started)
-   [Environment variables](#environment-variables)
-   [Running the application](#running-the-application)
-   [API overview](#api-overview)
-   [Development notes](#development-notes)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [License](#license)

## Overview

Searching for internships across multiple platforms can become difficult
to manage. VENTRO aims to make that process more focused by giving users
a central place to explore internship listings, narrow results with
filters, save opportunities, view listing details, and keep track of
applications.

The interface follows a clean, monochrome visual direction with light
and dark themes.

## Features

-   **Internship discovery** --- browse internship opportunities served
    by the backend.
-   **Search** --- find opportunities by role, company, or relevant
    listing information.
-   **Filters** --- narrow listings using available criteria such as
    location, company, internship type, category, experience, remote
    status, and saved status.
-   **Internship details** --- open a listing to review its information
    and application link.
-   **Saved internships** --- save and remove opportunities for later.
-   **Recently viewed** --- record internships opened by the user.
-   **Authentication** --- backend routes use JWT bearer-token
    authentication where required.
-   **Theme support** --- switch between light and dark appearances.

Feature availability may vary as development continues.

## Tech stack

  Layer              Technologies
  ------------------ -------------------------------------------
  Frontend           React, TypeScript, Vite
  Styling and UI     Tailwind CSS, Framer Motion, Lucide React
  Routing            React Router
  Backend            Python, Flask
  Database           PostgreSQL
  Authentication     JWT
  Password hashing   bcrypt

## Project structure

The repository is organized into frontend and backend applications:

``` text
InternTracker/
├── Backend/
│   ├── database/
│   ├── middleware/
│   ├── services/
│   └── app.py
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
└── README.md
```

Your local structure may contain additional folders and files.

## Getting started

### Prerequisites

Install the following before running the project: - Git - Node.js and
npm - Python 3 - PostgreSQL

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd InternTracker
```

### 2. Set up the backend

``` bash
cd Backend
python -m venv venv
```

Activate the virtual environment:

**Windows PowerShell**

``` powershell
.\venv\Scripts\Activate.ps1
```

**macOS / Linux**

``` bash
source venv/bin/activate
```

Install backend dependencies:

``` bash
python -m pip install -r requirements.txt
```

If `requirements.txt` is not present yet, install the dependencies used
by the current backend:

``` bash
python -m pip install Flask flask-cors psycopg2-binary bcrypt python-dotenv PyJWT google-auth
```

Configure the database and environment variables before starting the
server.

### 3. Set up the frontend

Open a second terminal:

``` bash
cd Frontend
npm install
```

If the frontend uses a local API URL, configure it as described below.

## Environment variables

Create the environment file expected by your backend configuration
(commonly `Backend/.env`). Do not commit secrets or real credentials.

Example template --- adjust the variable names to match the
configuration read by your backend:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME
JWT_SECRET_KEY=replace_with_a_long_random_secret
```

If your frontend uses `VITE_API_URL`, configure it in `Frontend/.env`:

``` env
VITE_API_URL=http://127.0.0.1:5001
```

Vite exposes variables prefixed with `VITE_` to browser code. Never put
database passwords, private API keys, or signing secrets in frontend
environment variables.

## Running the application

Start the backend from the `Backend` directory:

``` bash
python app.py
```

The development API is expected at:

``` text
http://127.0.0.1:5001
```

Start the frontend in a separate terminal:

``` bash
cd Frontend
npm run dev
```

Vite will print the local frontend URL in the terminal (commonly
`http://localhost:5173`).

## API overview

The frontend currently uses backend routes in these areas:

  -------------------------------------------------------------------------
  Method                  Route                     Purpose
  ----------------------- ------------------------- -----------------------
  `GET`                   `/internships`            Retrieve internship
                                                    listings

  `GET`                   `/internships/<id>`       Retrieve one internship

  `GET`                   `/saved`                  Retrieve the user's
                                                    saved internships

  `POST`                  `/saved/<id>`             Save an internship

  `DELETE`                `/saved/<id>`             Remove a saved
                                                    internship

  `POST`                  `/recently-viewed/<id>`   Record a recently
                                                    viewed internship
  -------------------------------------------------------------------------

Authentication requirements and request/response formats depend on the
backend route implementation. Send the JWT as a bearer token for
protected endpoints:

``` http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

## Development notes

-   Keep backend secrets in environment variables; never commit `.env`
    files.
-   Keep `Backend/requirements.txt` up to date when Python dependencies
    change.
-   Use the backend's database IDs when linking to internship detail
    pages.
-   The frontend API base URL should match the port on which Flask is
    running.
-   For local development, run the backend and frontend in separate
    terminals.

## Roadmap

Potential next steps as the project evolves: - Improve opportunity
discovery and relevance. - Expand application tracking and status
management. - Improve resume tailoring workflows. - Add further
automation around application organization. - Strengthen testing,
deployment, and documentation.

## Contributing

Contributions and suggestions are welcome.

1.  Fork the repository.
2.  Create a feature branch: `git checkout -b feature/your-feature`.
3.  Make focused changes and test them locally.
4.  Commit your changes: `git commit -m "Add: your feature"`.
5.  Push your branch and open a pull request.

## License

No license has been specified yet. Unless a license is added to this
repository, all rights remain with the copyright holder and reuse is not
automatically granted.
