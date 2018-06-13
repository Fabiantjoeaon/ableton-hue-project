class Store {
    constructor() {
        this.state = {
            colorSwitchTransition: 300,
            flashOnTransition: 100,
            flashOffTransition: 100,
            kickThreshold: 0.72,
            lowestHueBrightness: 50
        };
    }

    setState(key, val) {
        const newState = Object.assign({}, this.state);
        newState[key] = val;

        this.state = newState;
    }
}

module.exports = Store;
