const crypto = require("crypto");

const hash = (str,type) => {
    const cryptoMd5 = crypto.createHash(type);
    cryptoMd5.update(str);
    return cryptoMd5.digest("hex");
}

module.exports = function hashMask(mask) {
    return hash(
        JSON.stringify(mask),
        "md5"
    )
}