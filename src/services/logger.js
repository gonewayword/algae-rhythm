class Logger {

    log(str, obj) {
        if (!!obj) return console.log(str, obj);
        console.log(str);
    }

    debug(str, obj) {
        if (!!obj) return console.debug(str, obj);
        console.debug(str);
    }
}