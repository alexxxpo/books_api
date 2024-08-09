import nodemailer from "nodemailer";
import { Request, Response, NextFunction } from 'express'

const transporter = nodemailer.createTransport({
    //@ts-expect-error
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    //@ts-expect-error
    secure: process.env.SMTP_PORT === 465 ? true : false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function main() {
    await transporter.sendMail({
        from: process.env.SMTP_FROM, // sender address
        to: "alexand-90@yandex.ru", // list of receivers
        subject: "Confirm your email", // Subject line
        text: "Для подтверждения перейдите по ссылке", // plain text body
        html: "<a href='localhost:3000'>Ссылка</a>", // html body
    });

}

main().catch(console.error);

export const confirmEmail = (req: Request, res: Response, next: NextFunction) => {
    
} 