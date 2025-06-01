const cron = require('node-cron');

const notifyStudents = () => {
    cron.schedule('*/30* * * * *', async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const borrowedBooks = await BorrowModel.findBorrowedBooksBefore(oneDayAgo);
                dueDate: {
                    $lt : oneDayAgo,
                }
                
        }
    });
}

module.exports = {notifyStudents};
