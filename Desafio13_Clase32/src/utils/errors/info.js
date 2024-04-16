export const generateUserErrorInfo = (user)=>{
    return `One o more properties where incomplete or not valid.
    list of required properties:
    * first_name    : needs to be a String, received  ${user.first_name}
    * last_name     : needs to be a String, received  ${user.last_name}
    * email         : needs to be a String, received  ${user.email}` 
}