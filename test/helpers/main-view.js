import { LitElement } from 'lit-element';
import { ViewReactor } from '../../src/ViewReactor.js';

class MainView extends LitElement {
    constructor() {
        super();
        this.viewReactor = new ViewReactor(this);
    }

    render() {
        return this.viewReactor.view;
    }
}

customElements.define('main-view', MainView);
