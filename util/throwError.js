module.exports = function(message, statCode, errorsData){
    let error = new Error(`${message}`)
    error.statusCode = statCode || 500
    if(errorsData !== undefined){
        error.data = errorsData.array()
    }
    throw error
}