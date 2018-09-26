
module.exports = {

	sendErrorResponse: function(res, errorMessage, statusCode, headers) {

        const status = statusCode || 500;

        if (headers) {
            res.set(headers);
        }
        return res.status(status).send(errorMessage);
    }
}