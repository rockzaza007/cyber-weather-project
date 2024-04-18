
# Weather App Cyber Security Project

This project is developed for the Cyber Security subject, focusing on implementing various security measures while building a weather application. The application utilizes weather data from the TMD API, Google Firebase for authentication, Firestore for CRUD operations, and Strapi for login, registration, and CRUD operations. Docker-compose is used for containerization, with PostgreSQL as the database backend. The project consists of two main folders: Frontend (React) and StrapiBackend.

## Project Structure

```
weather-app/
│
├── Frontend/               # Frontend React application
│   ├── src/                # Source files
│   ├── public/             # Public files
│   ├── Dockerfile          # Dockerfile for frontend
│   ├── nginx.conf          # Nginx configuration
│   └── ...                 # Other frontend files
│
└── StrapiBackend/          # Strapi backend application
    ├── config/             # Configuration files
    ├── api/                # API controllers, models, services
    ├── plugins/            # Plugins
    ├── Dockerfile          # Dockerfile for Strapi backend
    ├── caddy.conf          # Caddy configuration
    └── ...                 # Other Strapi files
```

## Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/rockzaza007/weather-app.git
    ```

2. **Environment Variables:**

    Create a `.env` file in the `Frontend` directory with the following variables:

    ```plaintext
    GENERATE_SOURCEMAP=false
    REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
    REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
    REACT_APP_FIREBASE_DATABASE_URL=<your_firebase_database_url>
    REACT_APP_FIREBASE_PROJECT_ID=<your_firebase_project_id>
    REACT_APP_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
    REACT_APP_FIREBASE_APP_ID=<your_firebase_app_id>
    REACT_APP_STRAPI_API_TOKEN=<your_strapi_api_token>
    CLIENT_PORT=8080:80
    ```

    And in the `StrapiBackend` directory, create a `.env` file with the following variables:

    ```plaintext
    APP_KEYS="toBeModified1,toBeModified2"
    API_TOKEN_SALT=tobemodified
    ADMIN_JWT_SECRET=tobemodified
    TRANSFER_TOKEN_SALT=tobemodified
    JWT_SECRET=tobemodified
    SECRET_KEY=tobemodified
    SECRET_KEY_IV=tobemodified
    SERVER_IMAGE=strapi-weather/app:1.3.0
    SERVER_PORT=1337:1337
    DATABASE_CLIENT=postgres
    DATABASE_HOST=tobemodified
    DATABASE_PORT=tobemodified
    DATABASE_NAME=tobemodified
    DATABASE_USERNAME=tobemodified
    DATABASE_PASSWORD=tobemodified
    DATABASE_SSL=tobemodified
    ```

    Replace placeholders such as `<your_firebase_api_key>` and `<your_strapi_api_token>` with your actual API keys.

3. **Running the Application:**

    Navigate to the frontend directory of the project and run:

    ```bash
    cd frontend
    docker-compose up -d
    ```

    This command will start the containers defined in the `docker-compose.yml` file.

4. **Accessing the Application:**

    Once the containers are up and running, you can access the frontend application at `http://localhost:8080` and the Strapi backend at `http://localhost:9999`.

## Development

### Frontend (React)

To work on the frontend application:

1. Navigate to the `Frontend` directory:

    ```bash
    cd Frontend
    ```

2. Install dependencies:

    ```bash
    npm install || yarn install
    ```

3. Start the development server:

    ```bash
    npm start || yarn develop
    ```

    The development server will start at `http://localhost:3000`, and the React application will automatically reload if you make changes to the source code.

### Strapi Backend

To work on the Strapi backend:

1. Navigate to the `StrapiBackend` directory:

    ```bash
    cd StrapiBackend
    ```

2. Install dependencies:

    ```bash
    npm install || yarn install
    ```

3. Start the Strapi server:

    ```bash
    npm run develop || yarn develop
    ```

    The Strapi server will start at `http://localhost:1337/admin`, where you can access the Strapi admin panel to manage your content types and data.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or create a pull request.

## License

This project is licensed under the [KMUTNB License](LICENSE).