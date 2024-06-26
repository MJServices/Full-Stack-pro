class ApiResponse {
    constructor(
        status,
        data,
        success = true,
        message,
    ){
        this.status = status? status>400 : 200
        this.data = data
        this.success  = success
    }
}

export {ApiResponse}