import { Request, Response, NextFunction } from 'express'
import { AuthUser } from '../types'

export const authorization = async (req: Request<{}, {}, { user: AuthUser, rights: number }>, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const { method } = req
    console.log(req.body);
    
    if (user.rights === 1) {
        if(method === 'GET') {
            next();
        } else {
            return res.status(401).json({ error: 'Unathorized' });
        }
    }
    if (user.rights === 3) {
        next()
    }
    return res.status(401).json({ error: 'Unathorized' });
}
