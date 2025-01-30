const nodemailer = require("nodemailer");

//Testing con ethereal
/*let transporter;
(async () => {
    const testAccount = await nodemailer.createTestAccount();
    console.log("Account Ethereal generato:", testAccount);

    transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log(`Configurazione transporter completata: ${JSON.stringify(testAccount)}`);
})();*/

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendEmail = async (to, subject, content) => {
    try {
        const info = await transporter.sendMail({
            from: `"Easystance" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: content
        });

        console.log(`Email inviata: ${info.messageId}`);
        console.log(`Anteprima: ${nodemailer.getTestMessageUrl(info)}`);
        return info;
    } catch (error) {
        console.log(error);
    }
};