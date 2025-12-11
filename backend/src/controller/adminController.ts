import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getAdminByUsername } from '../models/adminModel';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const admin = await getAdminByUsername(username);
    if (!admin) return res.status(400).json({ error: 'Admin not found' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

