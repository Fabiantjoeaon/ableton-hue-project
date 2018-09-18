const setWith = require("lodash/setWith");
const defaultState = require("./defaultState");

const initialState = Object.assign({}, defaultState);

class Store {
    constructor() {
        this.state = Object.assign({}, defaultState);
    }

    setState(path, val) {
        // Not immutable
        this.state = setWith(this.state, path, val);
    }

    initDefaultState() {
        const copy = { ...initialState };
        this.state = copy;
    }

    //tweenState ?
}

module.exports = Store;
