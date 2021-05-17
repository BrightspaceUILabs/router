import { LitElement, html } from 'lit-element';
import { Router } from '../../src/router.js';

class MainView extends LitElement {
    constructor() {
        super();

        this.router = new Router(
            this,
            [
                {
                    pattern: '/',
                    view: () => html`<p>Index</p>`,
                },
                {
                    pattern: '/user',
                    view: () => html`<p>User</p>`,
                },
            ],
            { customPage: true, hashbang: true }
        );
    }

    render() {
        return this.router.view;
    }
}

customElements.define('main-view', MainView);
