import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getAdminByUsername } from '../models/adminModel';

export const login = async (req: Request, res: Response) => {
  console.log('[login] incoming body:', req.body);
  const { username, password } = req.body;
  try {
    const admin = await getAdminByUsername(username);
    if (!admin) {
      console.log('[login] admin not found for', username);
      return res.status(400).json({ error: 'Admin not found' });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      console.log('[login] invalid password for', username);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    console.log('[login] success, token length:', token.length);
    res.json({ token });
  } catch (err: any) {
    console.error('[login] error', err);
    res.status(500).json({ error: err.message });
  }
};
