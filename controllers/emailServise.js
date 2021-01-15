const sgMail = require('@sendgrid/mail');
var AWS = require('aws-sdk');
AWS.config.update({region: 'REGION'});


class EmailService{
    constructor(service){
        this.service = service
    }

    sendEmail(toAddress,fromAddress,subject,body_text,body_html){
        if(this.service === "AWS"){
            const msg = {
                Destination: { 
                  ToAddresses: [toAddress]
                },
                Message: { 
                  Body: { 
                    Html: {
                     Charset: "UTF-8",
                     Data: body_html
                    },
                    Text: {
                     Charset: "UTF-8",
                     Data: body_text
                    }
                   },
                   Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                   }
                  },
                Source: fromAddress
              };
            return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(msg).promise();
        }
        if(this.service === "Sendgrid"){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: toAddress,
                from: fromAddress,
                subject: subject,
                text: body_text,
                html: body_html
              }
              return sgMail.send(msg)
        }

    }
}



module.exports = EmailService


