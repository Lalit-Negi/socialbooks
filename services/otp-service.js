
const crypto = require("crypto")

class OtpService{
  static async hashOtp(hashData){
    return await crypto.createHash("sha512" , process.env.HASH_KEY ).update(hashData).digest("hex")
  }

  static async generateOtp(){
    return await crypto.randomInt(100000 , 999999)
  }

  static async verifyOtp(hashData, hash){
    return await crypto.createHash("sha512" , process.env.HASH_KEY).update(hashData).digest("hex") === hash
  }
}

module.exports = OtpService