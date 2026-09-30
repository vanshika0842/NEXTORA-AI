import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";

export const healthCheck = (req: Request, res: Response) => {
  const result = getHealthStatus();

  res.status(200).json(result);
};