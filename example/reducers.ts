


function reducer(state, action) {
    switch (action.type) {
        case 'init':
            return init;
        case 'setSearchOptions':
            return {...state, searchOptions: action.payload};

        case 'setDisabledBtn':
            return {...state, disabledBtn: action.payload};

        default:
            return state;
    }
}


const init = {
    searchOptions: []
};

const reducers = [{
    reducer,
    name: 'example',
    init
}];

export default reducers;
