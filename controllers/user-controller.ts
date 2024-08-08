import { Request, Response } from 'express'
import { AuthUser, UserType } from "../types";
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

            return res.status(201).json({ username: newUser.username, email: newUser.email, id: newUser.id, rights: newUser.rights });

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


            const token = jwt.sign({ userId: user.id, rights: user.rights }, process.env.SECRET_KEY as string);

            res.status(202).json({ token });

        } catch (error) {
            console.error(error, 'Ошибка логина');
            res.status(500).json({ error: 'Internal server error' });
        }

    }

    async current(req: Request<{}, {}, { user: AuthUser }>, res: Response) {
        const { user } = req.body;

        const id = user.userId;

        try {
            const currentUser = await prisma.user.findUnique({
                where: { id }
            })

            if (!currentUser) return res.status(404).json({ error: 'Пользователь не найден' })

            return res.status(200).json({ currentUser })
        } catch (error) {
            console.error(error, 'Ошибка запроса текущего пользователя');
            res.status(500).json({ error: 'Internal server error' });
        }

        return res.json(user)
    }

    async changeRole(req: Request, res: Response) {
        const { user } = req.body;

        const id = user.userId;
    }
}

export const userController = new UserController()