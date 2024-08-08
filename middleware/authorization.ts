import { Request, Response, NextFunction } from 'express'
import { AuthUser } from '../types'

export const authorization = (rightsMask: number) => {

    return (req: Request<{}, {}, { user: AuthUser }>, res: Response, next: NextFunction) => {
        const { user } = req.body;

        if (user.rights < rightsMask) {
            return res.status(401).json({ error: 'Недостаточно прав' });
        }
        next();
    }
}