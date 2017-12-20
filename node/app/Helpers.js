function isNullOrWhitespace(val) {
    if(!val)
        return true;
    if(val === "")
        return true;

    return false
}

module.exports = {
    isNullOrWhitespace: isNullOrWhitespace
};