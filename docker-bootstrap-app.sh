# migration
DATABASE_URL="postgres://rafi:passwordforhangry@postgres:5433/postgres" npx prisma migrate deploy

# run app
node ./dist/index.js