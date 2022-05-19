import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from logdecorator import logwrap
import logging
import os.path
import jsonCreator




def send_email(email_recipient,
               email_subject,
               email_message,
               attachment_location = ''):

    email_sender = 'NetworkAuditAnalyzer@cisco.com'

    msg = MIMEMultipart()
    msg['From'] = email_sender
    msg['To'] = email_recipient
    msg['Subject'] = email_subject

    msg.attach(MIMEText(email_message, 'plain'))

    if attachment_location != '':
        filename = os.path.basename(attachment_location)
        attachment = open(attachment_location, "rb")
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition',
                        "attachment; filename= %s" % filename)
        msg.attach(part)

    try:
        server = smtplib.SMTP('email.cisco.com')
        #server.ehlo()
        #server.starttls()
        #server.login('your_login_name', 'your_login_password')
        text = msg.as_string()
        server.sendmail(email_sender, email_recipient, text)
        print('email sent')
        server.quit()
    except Exception as e:
        print(e)
        print("SMPT server connection error")
    return True


def email_in(userid, para, link):	
    smtp_server = 'email.cisco.com'	
    sender = "NetworkAuditAnalyzer@cisco.com"	
    receivers = userid	
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!@@@@@@@@@@",userid)
    if para ==0:	
        subject = "Please do not reply to this mail."	
        body = "Hello \n\n error while uploading \n\n   -----  \n\n Regards, \n NAA Team"	
    elif para ==1:	
        subject = "Please do not reply to this mail."	
        body = f"""Hi, 

              Thank you for uploading the audit to Network Audit Analyser tool. The Dashboard is ready with visualisation and can be accessed using "Open Previous Audit" form at <link>
              Please reach out to bgl-cx-bcs-audit@cisco.com if you have any question
              {link}

              Thank you,
              BCS Audit team """	
    elif para ==2:	
        subject = "Please do not reply to this mail."	
        body = """Hi, 
                  Thank you for using Network Audit Analyser tool. The excel sheet report is ready to be downloaded from<link>
                  Please reach out to bgl-cx-bcs-audit@cisco.com if you have any questions
                  Thank you,
                  BCS Audit team """
	
    message = 'Subject: {}\n\n{}'.format(subject, body)	
    try:	
        sm = smtplib.SMTP(smtp_server)	
        sm.sendmail(sender, receivers, message)	
        print("Successfully sent email")	
    except Exception as e:	
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",userid)
        print(e)
        print("Error: unable to send email")