const CatchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch((err) => {
            // Ghi log lỗi để tiện theo dõi
            console.error(err);
            // Gọi middleware xử lý lỗi
            next(err);
        });
    }
}

module.exports = CatchAsyncErrors;