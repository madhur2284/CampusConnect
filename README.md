# CampusConnect — the campus board

CampusConnect is a marketplace for college students to buy and sell items within their campus community. Think of it as a digital corkboard: students post listings (with a photo, title, price, and description), browse what others are selling, and manage their own posts — all scoped to a college network.

## Features

- **Account system** — register and log in with your college email, name, contact number, and college name
- **JWT authentication** — access/refresh token flow with logout and password-change support
- **Browse listings** — paginated feed of active product listings
- **Sell items** — create a listing with an image (uploaded to Cloudinary), title, price, and description
- **My listings** — view and delete your own posted items
- **Responsive UI** — built with React, Vite, and Tailwind CSS, styled around a cork-board / pinboard aesthetic

## Tech stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python, async)
- [SQLAlchemy](https://www.sqlalchemy.org/) (async ORM) + [PostgreSQL](https://www.postgresql.org/)
- [Alembic](https://alembic.sqlalchemy.org/) for database migrations
- [Cloudinary](https://cloudinary.com/) for image hosting
- JWT-based authentication

**Frontend**
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## Project structure

```
CampusConnect/
├── backend/
│   ├── app/
│   │   ├── core/        # config, database, Cloudinary setup
│   │   ├── crud/        # database access helpers
│   │   ├── models/      # SQLAlchemy models (User, Product)
│   │   ├── routers/     # FastAPI route definitions (auth, product)
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   ├── services/    # business logic
│   │   └── main.py      # FastAPI app entrypoint
│   ├── alembic/         # database migrations
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # shared UI components
    │   ├── features/    # auth and product feature modules
    │   ├── pages/        # route-level pages
    │   ├── lib/          # API client
    │   └── styles/
    ├── public/
    └── package.json
```

## Getting started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### Backend setup

1. Navigate to the backend directory and create a virtual environment:

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # on Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root (`CampusConnect/.env`) with the following variables:

   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   SECRET_KEY=<your-secret-key>
   ACCESS_TOKEN_EXPIRY=<minutes>
   REFRESH_TOKEN_EXPIRY=<minutes>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   CORS_ORIGINS=http://localhost:5173
   ```

3. Run database migrations:

   ```bash
   alembic upgrade head
   ```

4. Start the API server:

   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

### Frontend setup

1. Navigate to the frontend directory and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API overview

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/auth/register`              | Register a new user                   |
| POST   | `/auth/login`                 | Log in and receive access/refresh tokens |
| POST   | `/auth/refresh`               | Refresh an access token               |
| POST   | `/auth/logout`                | Log out the current user              |
| POST   | `/auth/change_password`       | Change the current user's password    |
| GET    | `/auth/me`                    | Get the current user's profile        |
| GET    | `/product/items`              | Get a paginated list of active listings |
| POST   | `/product/items`              | Create a new listing (with image)     |
| GET    | `/product/items/me`           | Get the current user's own listings   |
| DELETE | `/product/items/{product_id}` | Delete one of the current user's listings |

## Contributing

Contributions are welcome. Please open an issue to discuss any significant changes before submitting a pull request.

## License

No license has been specified for this project yet.