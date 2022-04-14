import { Request, Response } from "express";
import pool from "../service/DataBase";

const getCustomer = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM car");
    res.status(200).json({ result: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export { getCustomer };
