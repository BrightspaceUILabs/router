import { LitElement } from 'lit-element';
import { RouteReactor } from '../../RouteReactor.js';

class MainView extends LitElement {
    static get properties() {
        return {
            'main-prop': { type: String, attribute: true },
        };
    }

    constructor() {
        super();
        this.route = new RouteReactor(this);
    }

    render() {
        return this.route.view
            ? this.route.view({ main: this['main-prop'] })
            : '';
    }
}

customElements.define('main-view', MainView);
