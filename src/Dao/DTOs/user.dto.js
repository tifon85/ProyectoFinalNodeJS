export class userDTO{

    constructor(user){
        this.first_name=user.first_name,
        this.last_name=user.last_name,
        this.email=user.email,
        this.password=user.password,
        this.isGithub=user.isGithub||false,
        this.isGoogle=user.isGoogle||false,
        this.role=user.role,
        this.cart=user.cart,
        this.resetToken=user.resetToken,
        this.ExpireresetToken_datetime=user.ExpireresetToken_datetime,
        this.documents=user.documents,
        this.last_connection=user.last_connection
    }
}