const cron = require('node-cron');
const sendEmail = require('../utils/sendEmail'); // Đường dẫn đến file sendEmail của bạn
const pool = require('../Database/config.js');
const { createReminderTemplate, createOverdueTemplate } = require('../utils/emailTemplates');
// Hàm lấy sách sắp đến hạn
const getBooksNearDueDate = async (daysAhead = 3) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    futureDate.setHours(23, 59, 59, 999);
    
    const result = await pool.query(`
        SELECT 
            bi.issue_id,
            bi.book_id,
            bi.student_id,
            bi.due_date,
            bi.status,
            b.title as book_title,
            u.name as student_name,
            u.email as student_email
        FROM book_issues bi
        JOIN students s ON bi.student_id = s.student_id
        JOIN books b ON bi.book_id = b.book_id
        JOIN users u ON s.user_id = u.user_id
        WHERE bi.return_date IS NULL 
        AND bi.status IN ('Issuing')
        AND bi.due_date >= $1 
        AND bi.due_date <= $2
        AND (bi.reminder_sent IS NULL OR bi.reminder_sent = false)
    `, [today, futureDate]);
    
    return result.rows;
};

// Hàm lấy sách quá hạn
const getOverdueBooks = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await pool.query(`
        SELECT 
            bi.issue_id,
            bi.book_id,
            bi.student_id,
            bi.due_date,
            bi.status,
            b.title as book_title,
            u.name as student_name,
            u.email as student_email
        FROM book_issues bi
        JOIN students s ON bi.student_id = s.student_id
        JOIN books b ON bi.book_id = b.book_id
        JOIN users u ON s.user_id = u.user_id
        WHERE bi.return_date IS NULL 
        AND bi.status IN ('issued', 'pending')
        AND bi.due_date < $1
        AND (bi.overdue_reminder_sent IS NULL OR bi.overdue_reminder_sent = false)
    `, [today]);
    
    return result.rows;
};

// Hàm đánh dấu đã gửi email nhắc nhở
const markReminderSent = async (issueId, type = 'reminder') => {
    const field = type === 'overdue' ? 'overdue_reminder_sent' : 'reminder_sent';
    const dateField = type === 'overdue' ? 'overdue_reminder_sent_at' : 'reminder_sent_at';
    
    await pool.query(`
        UPDATE book_issues 
        SET ${field} = true, ${dateField} = NOW()
        WHERE issue_id = $1
    `, [issueId]);
};

// Hàm chính để nhắc nhở học sinh
const notifyStudents = () => {
    // Chạy mỗi ngày lúc 9:00 AM - Nhắc nhở sắp đến hạn
    cron.schedule('0 9 * * *', async () => {
        try {
            console.log('Starting daily book reminder check...');
            
            const booksNearDue = await getBooksNearDueDate(3);
            console.log(`Found ${booksNearDue.length} books near due date`);
            
            // Gửi email cho từng sinh viên
            for (const book of booksNearDue) {
                try {
                    await sendEmail({
                        email: book.student_email,
                        subject: `📚 Nhắc nhở trả sách - ${book.book_title}`,
                        message: createReminderTemplate(
                            book.student_name,
                            book.book_title,
                            book.due_date
                        )
                    });
                    
                    // Đánh dấu đã gửi email nhắc nhở
                    await markReminderSent(book.issue_id, 'reminder');
                    
                    console.log(`Reminder email sent to ${book.student_email} for book: ${book.book_title}`);
                } catch (error) {
                    console.error(`Failed to send reminder email to ${book.student_email}:`, error);
                }
            }
            
            console.log('Daily reminder check completed');
            
        } catch (error) {
            console.error('Error in daily reminder check:', error);
        }
    });
    
    // Chạy mỗi ngày lúc 15:00 PM - Nhắc nhở quá hạn
    cron.schedule('0 15 * * *', async () => {
        try {
            console.log('Starting overdue book reminder check...');
            
            const overdueBooks = await getOverdueBooks();
            console.log(`Found ${overdueBooks.length} overdue books`);
            
            // Gửi email nhắc nhở quá hạn
            for (const book of overdueBooks) {
                try {
                    const today = new Date();
                    const dueDate = new Date(book.due_date);
                    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
                    
                    await sendEmail({
                        email: book.student_email,
                        subject: `🚨 KHẨN CẤP: Sách quá hạn ${daysOverdue} ngày - ${book.book_title}`,
                        message: createOverdueTemplate(
                            book.student_name,
                            book.book_title,
                            book.due_date,
                            daysOverdue
                        )
                    });
                    
                    // Đánh dấu đã gửi email quá hạn
                    await markReminderSent(book.issue_id, 'overdue');
                    
                    console.log(`Overdue email sent to ${book.student_email} for book: ${book.book_title}`);
                } catch (error) {
                    console.error(`Failed to send overdue email to ${book.student_email}:`, error);
                }
            }
            
            console.log('Overdue reminder check completed');
            
        } catch (error) {
            console.error('Error in overdue reminder check:', error);
        }
    });
    
    console.log('Book reminder cron jobs started');
};

// Hàm test gửi email
const testReminderEmail = async (email, name) => {
    try {
        await sendEmail({
            email,
            subject: '📚 Test - Nhắc nhở trả sách',
            message: createReminderTemplate(
                name,
                'Sách Test',
                new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            )
        });
        console.log('Test reminder email sent successfully');
    } catch (error) {
        console.error('Test reminder email failed:', error);
    }
};

const testOverdueEmail = async (email, name) => {
    try {
        await sendEmail({
            email,
            subject: '🚨 Test - Sách quá hạn',
            message: createOverdueTemplate(
                name,
                'Sách Test Quá Hạn',
                new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                5
            )
        });
        console.log('Test overdue email sent successfully');
    } catch (error) {
        console.error('Test overdue email failed:', error);
    }
};

module.exports = {
    notifyStudents,
    testReminderEmail,
    testOverdueEmail,
    getBooksNearDueDate,
    getOverdueBooks,
    markReminderSent
};