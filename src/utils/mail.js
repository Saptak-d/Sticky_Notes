import { body } from "express-validator";
import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const   sendMail  = async(options) =>{
    const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Task manager',
        link: 'https://mailgen.js/'
    }
});

        var emailText = mailGenerator.generatePlaintext(options.mailGenContent);
        var emailHtml = mailGenerator.generate(options.mailGenContent);


        const transporter = nodemailer.createTransport({
         host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_Password,
         },
    });
    const mail = {
     from: 'mail.taskmanager@example.com',
    to:options.email,
    subject: options.subject,
    text: emailText,// plain‑text body
    html: emailHtml, // HTML body
    }

    try {

     await transporter.sendMail(mail)
        
    } catch (error) {
         console.error("emailed failed and ",error)
    }

    }


const emailVerificationMailGenContent = (username,verificationURL) =>{

    return {
        body :{
            name :username,
              intro: 'Welcome to Sticky Notes! We\'re very excited to have you on board.',
              action: {
            instructions: 'To get started with Sticky Notes, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Verify your email',
                link: verificationURL,

                    },
             },
           outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        },
    }
}

const forgotPasswordMailGenContent = (username,passwordResetURL) =>{

    return {
        body :{
            name :username,
              intro: 'we got a request to reset your password',
              action: {
            instructions: 'To change the password click the Button  ',
            button: {
                color: '#d41f1fff', // Optional action button color
                text: 'Reset password',
                link: passwordResetURL,

                    },
             },
           outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        },
    }
}

// sendMail({
//     email :user.email,
//     subject : "Aaa",
//     mailGenContent : emailVerificationMailGenContent(username,` `)
    
// })