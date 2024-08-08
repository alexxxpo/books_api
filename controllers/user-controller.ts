import { Request, Response } from 'express'
import { UserType } from "../types";
import { prisma } from '../prisma/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController {
    async register(req: Request<{}, {}, UserType>, res: Response) {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Все поля обязательны' })
        }
        try {
            const existEmail = await prisma.user.findUnique({
                where: { email }
            })
            if (existEmail) {
                return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' })
            }
            const existUsername = await prisma.user.findUnique({
                where: { username }
            })
            if (existUsername) {
                return res.status(400).json({ error: 'Пользователь с таким именем уже зарегистрирован' })
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const newUser = await prisma.user.create({
                data: { email, username, password: hashPassword }
            })

            return res.status(201).json({ username: newUser.username, email: newUser.email, id: newUser.id });

        } catch (error) {
            console.error(error, 'Ошибка регистрации пользователя');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })
            if (!user) return res.status(400).json({ error: 'Все поля обязательны' });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(400).json({ error: 'Все поля обязательны' });

            
            const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY as string);

            res.json({token});

        } catch (error) {
            console.error(error, 'Ошибка логина');
            res.status(500).json({ error: 'Internal server error' });
        }

    }

    async current(req: Request, res: Response) {
        return res.json({current: 'user'})
    }

    async changeRole(req: Request, res: Response) {

    }
}

export const userController = new UserController()