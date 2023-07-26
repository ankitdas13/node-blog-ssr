const { validToken } = require("../services/authentication")

function checkAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        console.log(tokenCookieValue)
        if (!tokenCookieValue) {
            console.log("flagggg")
            return next()
        }

        //  next()

        //    
        try {
            const userPayload = validToken(tokenCookieValue)
            console.log(userPayload)
            req.user = userPayload
        } catch (error) { }
        
       return next()
    }
}

module.exports = {
    checkAuthenticationCookie
}