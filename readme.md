# User Subject API

A RESTful API for managing user subjects.

## Features

- CRUD operations for user subjects
- JWT authentication
- Input validation

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```bash
npm install
```

### Running the API

```bash
npm start
```

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/subjects`        | List all subjects        |
| POST   | `/subjects`        | Create a new subject     |
| GET    | `/subjects/:id`    | Get subject by ID        |
| PUT    | `/subjects/:id`    | Update subject by ID     |
| DELETE | `/subjects/:id`    | Delete subject by ID     |

## License

MIT