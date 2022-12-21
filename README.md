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

To run this app you can follow this step:

1. via docker

    1. run database services with this command:
        ```
        docker compose up
        ```
        or
        ```
        docker-compose up
        ```

2. if you don't have docker installed on your local machine, you can download the postgresl and redis then set the credential on .env to match with your databases credential

3. Download depedencies
    ```
    npm install
    ```
4. Run migration first with this command
    ```
    npx prisma db push
    ```
5. Run
    ```
    npm run dev
    ```
6. By default the program will be run on port 8081, and you can access it with http://localhost:8081
