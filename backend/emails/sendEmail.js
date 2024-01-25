import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(receiver, dynamic_template_data, isInv) {
  let msg;

  if (isInv) {
    msg = {
      to: receiver, // Change to your recipient
      from: process.env.FROM, // Change to your verified sender
      templateId: process.env.TEMPLATE_ID_I,
      dynamic_template_data,
    };
  } else {
    msg = {
      to: receiver, // Change to your recipient
      from: process.env.FROM, // Change to your verified sender
      templateId: process.env.TEMPLATE_ID_C,
      dynamic_template_data,
    };
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

export default sendEmail;
