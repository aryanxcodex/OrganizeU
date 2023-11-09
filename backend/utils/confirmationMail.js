import jwt from 'jsonwebtoken';
import sendEmail from '../emails/sendEmail.js';

const confirmationMail = (receiver, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    const dynamic_template_data = {
        "url": `http://localhost:5173/confirm?token=${token}`,
    }

    sendEmail(receiver, dynamic_template_data);
}

export default confirmationMail;