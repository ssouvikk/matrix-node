class BaseService {
    constructor(){
        this.message = ''
    }
    response(data ={}, success = true, status = 200){
        return{
            success: success,
            message: this.message,
            data:data,
            status:status
        }
    }
}
module.exports = BaseService;