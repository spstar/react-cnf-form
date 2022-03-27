

export function getSearchData(params) {

    return new Promise((resolve, reject) => {
        const data = Array(Math.floor(Math.random() * 10)).fill('').map((it, idx) => {
            return {
                label: params.key + Math.random().toString(36).substring(2).toLowerCase(),
                value: idx
            };
        });

        setTimeout(resolve, Math.floor(Math.random() * 200), data)
    });
}
