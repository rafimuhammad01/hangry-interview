import { Express } from "express";


export const userRoute = (app : Express):  Express => {
    app.post("/register")

    return app
}