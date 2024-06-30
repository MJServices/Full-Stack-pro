class ApiResponse {
    constructor(
        status,
        data,
        success = true,
        message,
    ){
        this.status = status
        this.data = data
        this.success  = success
        this.message = message
    }
}

export {ApiResponse}