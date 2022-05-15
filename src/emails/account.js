const sgMail = require('@sendgrid/mail');
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jazzybyksp@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}.`
    })
}

module.exports = {
    sendWelcomeMail
}

