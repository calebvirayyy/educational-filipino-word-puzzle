export default {
    DEBUG_MODE: false,
    log: function (message) {
        if (this.DEBUG_MODE === true) {
            console.log('[DEBUG] ' + message);
        }
    }
}