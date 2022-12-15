import { Request, Response } from "express";

export const healthHandler = async (req: Request, res: Response) => {
  res.json({
    health: "OK",
  });
};
