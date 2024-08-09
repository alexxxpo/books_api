import { Request, Response } from 'express'
import { AuthUser, UserType } from "../types";
import { prisma } from '../prisma/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mailer } from '../utils/mailer';

class UserController {
    public async register(req: Request<{}, {}, UserType>, res: Response) {
        const { email, password, username } = req.body;
        if (!email || !password || !username) return res.status(400).json({ error: 'Все поля обязательны' });

        try {
            const existEmail = await prisma.user.findUnique({ where: { email } });
            if (existEmail) return res.status(400).json({ error: 'Пользователь с таким email уже зарегистрирован' });

            const existUsername = await prisma.user.findUnique({ where: { username } });
            if (existUsername) return res.status(400).json({ error: 'Пользователь с таким именем уже зарегистрирован' });

            const hashPassword = await bcrypt.hash(password, 10);


            const token = jwt.sign({ email }, process.env.SECRET_KEY as string, { expiresIn: 60 * 60 * 24 });

            const confirmLink = 'http://' + process.env.HOST + '/users/confirm/' + token;

            await mailer(email, confirmLink);

            const newUser = await prisma.user.create({
                data: { email, username, password: hashPassword }
            })

            return res.status(201).json({ username: newUser.username, email: newUser.email, id: newUser.id, rights: newUser.rights });

        } catch (error) {
            console.error(error, 'Ошибка регистрации пользователя');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async login(req: Request, res: Response) {
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

    public async current(req: Request<{}, {}, { user: AuthUser }>, res: Response) {
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

    public async changeRole(req: Request<{ id: number }, {}, { role: string, user: AuthUser }>, res: Response) {
        const id = +req.params.id

        if (!req.body.role) return res.status(204).json({ message: 'Роль не изменена' })
        const rights = Number.parseInt(req.body.role);

        try {
            const existRole = await prisma.roles.findUnique({
                where: {
                    rights
                }
            })

            if (!existRole) return res.status(404).json({ error: 'Роль не существует' });

            const existUser = await prisma.user.findUnique({
                where: { id }
            })

            if (!existUser) return res.status(404).json({ error: 'Пользователь не найден' });

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { rights },
            });

            return res.status(200).json({ username: updatedUser.username, email: updatedUser.email, id: updatedUser.id, rights: updatedUser.rights });

        } catch (error) {
            console.error(error, 'Ошибка смены роли польователя');
            res.status(500).json({ error: 'Internal server error' });
        }


    }

    public async confirmEmail(req: Request<{ token: string }>, res: Response) {
        const token = req.params.token
        jwt.verify(token, process.env.SECRET_KEY as string, async (err, data) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' })
            }
            //@ts-expect-error
            const email = data?.email as string
            try {
                const user = await prisma.user.findUnique({ where: { email: email } })
    
                if(!user) return res.status(404).json({error: 'Пользователь с таким email не зарегистрирован'})
    
                return res.status(202).json({message: `Email ${email} подтвержден`})                
            } catch (error) {
                console.error('Ошибка подтверждения email', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        })
    }
}

export const userController = new UserController()