const EmailBlackList = require('../models/EmailBlackList')
const EmailService = require ('./emailServise')

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.addToBlackList = (req,res,next) =>{
    const email = req.body.email_address
    if (!validateEmail(email)) {
        const error = new Error('Validation failed, entered address is not an email.');
        error.statusCode = 422;
        throw error;
    }
    const addingEmail = new EmailBlackList({email:email})
    addingEmail.save()
    .then(result => {
        res.status(201).json({
          message: `Email address ${email} was blacklisted successfully!`
        });
      })
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

exports.sendEmail = (req,res,next) =>{
    const emailTo = req.body.to
    const emailFrom = req.body.from
    const subject = req.body.subject
    const body_text = req.body.body_text
    const body_html = req.body.body_html

    function emailFactory(serviceType){ return new EmailService (serviceType)}

    if (!validateEmail(emailFrom) || !validateEmail(emailTo)) {
        const error = new Error('Validation failed, entered address is not an email.');
        error.statusCode = 422;
        throw error;
    }

    EmailBlackList.findOne({ email: emailTo })
        .then(email => {
            if (email) {
                const error = new Error('This email is blacklisted.');
                error.statusCode = 401;
                throw error;
            }
        })
        .then(result=>{
           return emailFactory('AWS').sendEmail(emailTo,emailFrom,subject,body_text,body_html)
        })
        .then(result => {
            console.log(result)
            res.status(201).json({
              message: `Email was sent successfully!`
            });
          })
        .catch(err => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });

}

