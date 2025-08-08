import emailjs from '@emailjs/browser';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

type ClientDetails = {
  nameResetter(s:string):void,
  emailResetter(s:string):void,
  subjectResetter(s:string):void,
  messageResetter(s:string):void,
  clientDetails:string[],
  setEmailSent(val:boolean): void,
  contactForm:boolean
}

export type EmailSenderRef = {
  sendEmail: () => void;
};

const EmailSender = forwardRef<EmailSenderRef, ClientDetails>((details, ref) => {
  const [emailStatus, setEmailStatus] = useState<string>('')
  const [showAlert, setShowAlert] = useState(false)
  const name = details.clientDetails[0]
  const email = details.clientDetails[1]
  const subject = details.clientDetails[2]
  const message = details.clientDetails[3]
  
  if(!email){
    console.log("Client Email is Empty");
  }
  
  const SERVICE_ID: any = process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID
  const EMAIL_TRMPLATE_ID: any = process.env.NEXT_PUBLIC_EMAIL_TRMPLATE_ID
  const PUBLIC_KEY:any = process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
  useEffect(() => emailjs.init({publicKey:process.env.PUBLIC_KEY}), []);  

 // send email to self
  const sendEmail =()=>{
    emailjs
    .send( SERVICE_ID, EMAIL_TRMPLATE_ID, {
      name: !name ? "Name not provided" : name, 
      customer_email:email,
      title: subject,
      message: message
    }, PUBLIC_KEY)
    .then(
      () => {          
        setEmailStatus('success')
        details.setEmailSent(true)
        console.log('Sent Email');
        setShowAlert(true)
      },
      (error:any) => {
        console.log('Failed Sending Email!...', JSON.stringify(error));
        details.setEmailSent(false)
        setEmailStatus('error')
        setShowAlert(true)
      },
    );
  }

  useImperativeHandle(ref, () => ({
    sendEmail,
  }));

  return (
    showAlert && details.contactForm? 
    ( 
      <div className='email-sender'>
        { 
          <Slide direction="up" in={showAlert} mountOnEnter unmountOnExit>
            <Fade
              in={showAlert}
              timeout={{ enter: 1000, exit: 1000 }} 
              addEndListener={() => {
                setTimeout(() => {
                  details.nameResetter('')
                  details.subjectResetter('')
                  details.emailResetter('')
                  details.messageResetter('')
                  setShowAlert(false)
                }, 1000);
                }
              }   
            >
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity={emailStatus == "error" ? 'error' : 'success' }>{emailStatus == 'success' ? "Message Sent Successfully" : "Something Went Wrong. Please Try Again Later"}</Alert>
              </Stack>
            </Fade>
        </Slide>
        }
      </div>
    ) : (
      <div className='email-sender'>
        </div>
    )
  )
});

export default EmailSender