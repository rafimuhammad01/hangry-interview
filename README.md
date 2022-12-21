# Hangry! Take Home Interview

This is repository for Hangry take home interview. This is an API for to do application that have features such as:

1. Register User
2. Login User
3. Add a new todo
4. Get list of todo (can filter based on assignee)
5. Update todo status (only by todo creator)
6. Delete existing todo (only by todo creater)

## Documentation

For the documentation of the API you can look through [here](https://documenter.getpostman.com/view/14157544/2s8Z6scbmy)

## How to run

### Before you run

1.  Create the .env file from .env.example, you can use the default value from .env.example or modified it the database credential

### Run program

#### **With Docker**

If you have docker on your local computer it is recommended to use docker.

1. Up all services with docker
    ```
    docker compose up -d
    ```
2. By default the program will be run on port 8081, and you can access it with http://localhost:8081

####

**Without Docker**

If you want to do it manually, you can follow this step:

1. Download `postgresql` on local
2. Download `redis` on local
3. Download depedencies
    ```
    npm install
    ```
4. Run
    ```
    npm run dev
    ```
5. By default the program will be run on port 8081, and you can access it with http://localhost:8081

## Before you try the API, you need to do migrations first

You should do the migration first with this command

```
npx prisma db push
```

note: if you run with docker, you must go inside the app container to run this command. If you run with local you must edit the `DATABASE_URL` in .env to match your database credential
