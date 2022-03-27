export function delay(func, mSec) {
    let timer;
    const fn = (...args) => {
        clearTimeout(timer);
        timer = setTimeout(func, mSec, ...args);
    };

    fn.cancel = () => {
        clearTimeout(timer);
    };

    fn.now = (...args) => {
        clearTimeout(timer);
        func(...args);
    };

    return fn;
}

export function noop() {

}
