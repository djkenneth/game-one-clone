# Prisma Commands Reference

> **Prisma version:** 7.x
> **Database:** PostgreSQL
> **Multi-schema:** `uac`, `seller`, `catalog`, `sales`, `payment`, `logistics`, `wallet`, `review`

---

## Prerequisites

Make sure your `.env` file has the connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

The connection URL is consumed by `prisma/prisma.config.ts` for migrations.

---

## 1. Initial Setup

### Install dependencies
```bash
bun install
```

### Generate Prisma Client
Must be run after any schema change.
```bash
bunx prisma generate
```

### Create all schemas in the database (first time only)
```bash
bunx prisma migrate dev --name init
```

---

## 2. Migrations

### Create and apply a new migration (development)
```bash
bunx prisma migrate dev --name <migration_name>
```
> Example: `bunx prisma migrate dev --name add_product_images`

### Create a migration file without applying it
```bash
bunx prisma migrate dev --create-only --name <migration_name>
```

### Apply pending migrations (production / CI)
```bash
bunx prisma migrate deploy
```

### Check migration status
```bash
bunx prisma migrate status
```

### Resolve a failed migration (mark as applied without running)
```bash
bunx prisma migrate resolve --applied <migration_name>
```

### Resolve a failed migration (mark as rolled back)
```bash
bunx prisma migrate resolve --rolled-back <migration_name>
```

---

## 3. Reset & Seed

### Reset database + re-run all migrations + run seed
```bash
bunx prisma migrate reset
```

### Reset database + re-run all migrations (skip seed)
```bash
bunx prisma migrate reset --skip-seed
```

### Run seed only (without resetting)
```bash
bunx prisma db seed
```

> Seed file is configured in `package.json`:
> ```json
> "prisma": { "seed": "bun prisma/seed.ts" }
> ```

---

## 4. Push Schema (Prototyping — no migration files)

> Use this only in development for quick iteration. **Do not use in production.**

```bash
bunx prisma db push
```

### Force push (drops data that conflicts with schema)
```bash
bunx prisma db push --force-reset
```

---

## 5. Pull Schema from Database

Introspects the existing database and updates `schema.prisma`.

```bash
bunx prisma db pull
```

---

## 6. Prisma Studio (GUI)

Open the visual database browser at `http://localhost:5555`.

```bash
bunx prisma studio
```

---

## 7. Validate Schema

Check `schema.prisma` for errors without generating the client.

```bash
bunx prisma validate
```

---

## 8. Format Schema

Auto-format `schema.prisma` to Prisma style.

```bash
bunx prisma format
```

---

## 9. Execute Raw SQL

Run an arbitrary SQL file against the database.

```bash
bunx prisma db execute --file ./path/to/script.sql --schema prisma/schema.prisma
```

---

## 10. Package.json Scripts (already configured)

| Script | Command |
|---|---|
| `bun run migrate` | `prisma migrate dev` |
| `bun run migration:create` | `prisma migrate dev --create-only` |
| `bun run migration:prod` | `prisma migrate deploy` |
| `bun run reset` | `prisma migrate reset --skip-seed` |
| `bun run reset:seed` | `prisma migrate reset` |
| `bun run studio` | `prisma studio` |

---

## Common Workflow

### First-time setup
```bash
bun install
bunx prisma migrate dev --name init
```

### After editing schema.prisma
```bash
bunx prisma migrate dev --name <describe_your_change>
# client is auto-generated after migrate dev
```

### Production deploy
```bash
bunx prisma migrate deploy
```

### Wipe and start fresh (dev only)
```bash
bunx prisma migrate reset
```
