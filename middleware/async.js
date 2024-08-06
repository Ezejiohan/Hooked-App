const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            console.log(error)
            if (error instanceof jwt.JsonWebTokenError){
                res.json('Link has expired')
            }
            next(error)
        }
    }
}

module.exports = asyncWrapper;