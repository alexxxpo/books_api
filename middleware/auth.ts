import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers['authorization'];
    
    const token = authHeaders && authHeaders.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Unathorized' });
    }
    
    jwt.verify(token, process.env.SECRET_KEY as string, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' })
        }
        
        // @ts-expect-error
        req.user = user;
        
        next();
    })
}
