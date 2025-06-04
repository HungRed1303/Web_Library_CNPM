import { generationVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode,email, res) {
    try {
        const message = generationVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject: "Verification Code",
            message,
        });
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully.",
            data: {
                verificationCode
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending the verification code.",
            error: error.message
        });
    }
}
