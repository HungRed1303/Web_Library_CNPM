async function generationVerificationOtpEmailTemplate(otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #fff; text-align: center;">Verify Your Email Address</h2>
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      <p style="font-size: 16px; color: #ccc;">To complete your registration or login, please use the following verification code:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #000; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px;">
          ${otpCode}
        </span>
      </div>
      
      <p style="font-size: 16px; color: #ccc;">This code is valid for 15 minutes. Please do not share this code with anyone.</p>
      <p style="font-size: 16px; color: #ccc;">If you did not request this code, please ignore it.</p>
      
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you,<br>Bookworm Team</p>
        <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

async function generationForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      <p style="font-size: 16px; color: #ccc;">You requested to reset your password. Please click the button below to proceed:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordUrl}" 
           style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; text-decoration: none; background-color: #f0f0f0; padding: 12px 24px; border-radius: 5px; border: 2px solid #007bff;">
          Reset Password
        </a>
      </div>
      
      <p style="font-size: 16px; color: #ccc;">If you did not request this, please ignore this email. The link will expire in 15 minutes.</p>
      <p style="font-size: 16px; color: #ccc;">If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p style="font-size: 14px; color: #fff; word-wrap: break-word;">${resetPasswordUrl}</p>
      
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">
        <p>Thank you,<br>Bookworm Team</p>
        <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

const createReminderTemplate = (studentName, bookTitle, dueDate) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">📚 Thư viện ABC</h1>
                    <div style="width: 50px; height: 3px; background-color: #3498db; margin: 10px auto;"></div>
                </div>
                
                <h2 style="color: #e67e22; margin-bottom: 20px;">Nhắc nhở trả sách</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    Chào <strong style="color: #2c3e50;">${studentName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    Bạn có sách sắp đến hạn trả. Vui lòng kiểm tra thông tin chi tiết bên dưới:
                </p>
                
                <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50; width: 120px;">📖 Tên sách:</td>
                            <td style="padding: 8px 0; color: #34495e;">${bookTitle}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">📅 Hạn trả:</td>
                            <td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">${new Date(dueDate).toLocaleDateString('vi-VN')}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                        ⚠️ <strong>Lưu ý:</strong> Vui lòng trả sách đúng hạn để tránh bị phạt và ảnh hưởng đến quyền mượn sách.
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <div style="background-color: #3498db; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                        <p style="margin: 0; font-size: 14px;">
                            📍 <strong>Địa chỉ thư viện:</strong> [Địa chỉ của bạn]<br>
                            📞 <strong>Hotline:</strong> [Số điện thoại]<br>
                            ⏰ <strong>Giờ mở cửa:</strong> 8:00 - 17:00 (Thứ 2 - Chủ nhật)
                        </p>
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin: 0;">
                    Trân trọng cảm ơn,<br>
                    <strong style="color: #2c3e50;">Đội ngũ Thư viện ABC</strong>
                </p>
            </div>
        </div>
    `;
};

// Template email nhắc nhở quá hạn
const createOverdueTemplate = (studentName, bookTitle, dueDate, daysOverdue) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-top: 5px solid #e74c3c;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #e74c3c; margin: 0;">🚨 THÔNG BÁO KHẨN CẤP</h1>
                    <div style="width: 50px; height: 3px; background-color: #e74c3c; margin: 10px auto;"></div>
                </div>
                
                <h2 style="color: #c0392b; margin-bottom: 20px; text-align: center;">SÁCH QUÁ HẠN TRẢ</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    Chào <strong style="color: #2c3e50;">${studentName}</strong>,
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #e74c3c; font-weight: bold;">
                    Bạn có sách đã quá hạn trả. Vui lòng trả sách ngay lập tức!
                </p>
                
                <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #e74c3c;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #c0392b; width: 120px;">📖 Tên sách:</td>
                            <td style="padding: 8px 0; color: #34495e;">${bookTitle}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #c0392b;">📅 Hạn trả:</td>
                            <td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">${new Date(dueDate).toLocaleDateString('vi-VN')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #c0392b;">⏰ Quá hạn:</td>
                            <td style="padding: 8px 0; color: #e74c3c; font-weight: bold; font-size: 18px;">${daysOverdue} ngày</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c6cb;">
                    <h3 style="color: #721c24; margin-top: 0;">⚠️ Hậu quả của việc trả sách muộn:</h3>
                    <ul style="color: #721c24; margin: 10px 0; padding-left: 20px;">
                        <li>Phạt tiền theo quy định thư viện</li>
                        <li>Tạm ngưng quyền mượn sách mới</li>
                        <li>Ảnh hưởng đến hồ sơ học tập</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background-color: #e74c3c; color: white; padding: 20px; border-radius: 8px; display: inline-block;">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px;">🏃‍♂️ HÀNH ĐỘNG NGAY</h3>
                        <p style="margin: 0; font-size: 14px;">
                            📍 <strong>Địa chỉ thư viện:</strong> [Địa chỉ của bạn]<br>
                            📞 <strong>Hotline:</strong> [Số điện thoại]<br>
                            ⏰ <strong>Giờ mở cửa:</strong> 8:00 - 17:00 (Thứ 2 - Chủ nhật)
                        </p>
                    </div>
                </div>
                
                <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 30px 0;">
                
                <p style="font-size: 14px; color: #7f8c8d; text-align: center; margin: 0;">
                    Liên hệ ngay với chúng tôi nếu có bất kỳ vấn đề gì!<br>
                    <strong style="color: #e74c3c;">Đội ngũ Thư viện ABC</strong>
                </p>
            </div>
        </div>
    `;
};

const createLibraryCardAcceptanceTemplate = ({
    studentName,
    cardId,
    startDate,
    endDate,
}) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2c3e50; margin: 0;">📚 THE H Library</h1>
                    <div style="width: 50px; height: 3px; background-color: #3498db; margin: 10px auto;"></div>
                </div>

                <h2 style="color: #27ae60; margin-bottom: 20px;">Library Card Request Accepted</h2>

                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    Dear <strong style="color: #2c3e50;">${studentName}</strong>,
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    Your request for a library card has been accepted. Here are the details:
                </p>

                <div style="background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50; width: 140px;">📇 Name:</td>
                            <td style="padding: 8px 0; color: #34495e;">${studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">#️⃣ Card Number:</td>
                            <td style="padding: 8px 0; color: #34495e;">${cardId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">📅 Issue Date:</td>
                            <td style="padding: 8px 0; color: #34495e;">${startDate}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #2c3e50;">⌛ Expiry Date:</td>
                            <td style="padding: 8px 0; color: #34495e;">${endDate}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #34495e;">
                    You can use this card to borrow books at our library. Please keep your card safe and do not share your information with others.
                </p>
            </div>
        </div>
    `;
};

module.exports = { generationVerificationOtpEmailTemplate, generationForgotPasswordEmailTemplate, createOverdueTemplate, createReminderTemplate, createLibraryCardAcceptanceTemplate};
// Cách sử dụng:
// const emailHtml = generateVerificationOtpEmailTemplate("123456");
// console.log(emailHtml);

// Hoặc có thể export default nếu chỉ có 1 function:
// export default generateVerificationOtpEmailTemplate;