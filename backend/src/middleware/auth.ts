import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/user';

dotenv.config();

if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const displayName = decodedToken.name || 'Unknown User';

    // Create user in DB if doesn't exist
    await User.findOrCreate({
      where: { id: uid },
      defaults: { displayName },
    });

    (req as any).uid = uid;
    next();
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
