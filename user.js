const crypto = require('crypto');


class User{
    constructor(username){
        this._id = crypto.randomUUID().toString()
        this.username = username;
        this.log = []
    }

}

module.exports = User
