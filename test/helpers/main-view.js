import { LitElement } from 'lit-element';
import { RouteReactor } from '../../RouteReactor.js';

class MainView extends LitElement {
    constructor() {
        super();
        this.route = new RouteReactor(this);
    }

    render() {
        return this.route.view;
    }
}

customElements.define('main-view', MainView);
