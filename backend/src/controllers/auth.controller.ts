import { Request, Response } from "express";

import { registerUser,loginUser,getCurrentUser } from "../services/auth.service";
import {
  AuthRequest
} from "../middleware/auth.middleware";


//REGISTER
export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const user = await registerUser(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed"
    });
  }
};

//LOGIN
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const result = await loginUser(
      email,
      password
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed"
    });
  }
};


//getuser
export const me = async (
  req: Request,
  res: Response
) => {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.userId) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    const user = await getCurrentUser(
      authReq.userId
    );

    return res.status(200).json({
      user
    });

  } catch (error) {
    return res.status(404).json({
      message:
        error instanceof Error
          ? error.message
          : "User not found"
    });
  }
};