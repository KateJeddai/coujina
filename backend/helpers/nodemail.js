require('../../config/config.js');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    "https://developers.google.com/oauthplayground" 
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

const sendMail = (user, htmlMsg, msgType) => {
    const subject = msgType === "credential" ? 'Restore your credentials' : 'Confirm your email';
    console.log(user)
    const transporter = nodemailer.createTransport({        
            service: "gmail",
            auth: {
                 type: "OAuth2",
                 user: "arab.freeresources@gmail.com", 
                 clientId: process.env.GOOGLE_ID,
                 clientSecret: process.env.GOOGLE_SECRET,
                 refreshToken: process.env.REFRESH_TOKEN,
                 accessToken: accessToken,
                 tls: {
                    rejectUnauthorized: false
                 }
            }
    });
    
    const mailOptions = {
              from: "arab.freeresources@gmail.com", 
              to: user.email, 
              subject: subject, 
              html: htmlMsg
    };

    transporter.sendMail(mailOptions, function (err, info) {
              if(err) console.log(err);
              else console.log(info);
    }); 
}


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.APP_ADMIN,
//         pass: process.env.ADMIN_PASS
//     }
// });

// const sendMail = (user, host) => {
//     const link = "http://" + host + "/auth/verify?token=" + user.confirmToken;
//     const mailOptions = {
//                 from: process.env.APP_ADMIN, 
//                 to: user.email, 
//                 subject: 'Confirm your email', 
//                 html: "Please, click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
//     };

//     transporter.sendMail(mailOptions, function (err, info) {
//                 if(err) console.log(err);
//                 else console.log(info);
//     }); 
// }

// const sendMailToRestoreCredentials = (user, host, credential) => {
//     const link = credential === 'username' ? null : 
//                                             "http://" + host + "/new-password?token=" + user.confirmToken;    
//     const mailOptions = credential === 'username' ? {
//                 from: process.env.APP_ADMIN, 
//                 to: user.email, 
//                 subject: 'Restore your credentials', 
//                 html: "Your username is " + user.username
//     } : {
//             from: process.env.APP_ADMIN, 
//             to: user.email, 
//             subject: 'Restore your credentials', 
//             html: "To restore your " + credential + " click<a href=" + link + "> here</a>"
//     };

//     transporter.sendMail(mailOptions, function (err, info) {
//                 if(err) console.log(err);
//                 else console.log(info);
//     }); 
// }

module.exports = {sendMail};
