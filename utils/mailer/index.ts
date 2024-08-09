import nodemailer from "nodemailer";

export async function mailer(to: string, link: string) {
const transporter = nodemailer.createTransport({
    //@ts-expect-error
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    //@ts-expect-error
    secure: process.env.SMTP_PORT == 465 ? true : false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});


    console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASSWORD);
    console.log(to, link);
    
    await transporter.sendMail({
        from: process.env.SMTP_FROM, // sender address
        to, // list of receivers
        subject: "Confirm your email", // Subject line
        html: `<p>Для подтверждения перейдите по ссылке <a href="${link}">${link}</a>. Ссылка действительна 24 часа.</p>`, // html body
    });

}
