# How to run

## 1. Copy env file

```bash
cp .env.example .env

```

## 2. Start PostgreSQL

```bash
docker compose up -d
```

## 3. Install dependencies

```bash
npm install
```

## 4. Run the app

```bash
npm run dev
```

App runs at:

```text
http://localhost:3000
```

## 5. Call the APIs

### Health check

```bash
curl http://localhost:3000/health
```

### Create resource

```bash
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"demo"}'
```

### Get resource list

```bash
curl http://localhost:3000/resources
```

### Get resource list with filter

```bash
curl "http://localhost:3000/resources?name=demo"
```

### Get resource by id

```bash
curl http://localhost:3000/resources/1
```

### Update resource

```bash
curl -X PATCH http://localhost:3000/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"demo updated"}'
```

### Delete resource

```bash
curl -X DELETE http://localhost:3000/resources/1
```

## Notes

- App URL: `http://localhost:3000`
- Postgres port: `5432`
- Use `.env` for database config
