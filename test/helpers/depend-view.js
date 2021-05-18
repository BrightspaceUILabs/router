import { LitElement, html } from 'lit-element';
import { Router } from '../../src/router.js';

class DependView extends LitElement {
    constructor() {
        super();

        this.router = new Router(
            this,
            [
                {
                    pattern: '/',
                    loader: () => import('./lazy-comp.js'),
                    view: () => html`<lazy-view></lazy-view>`,
                },
            ],
            { customPage: true, hashbang: true }
        );
    }

    render() {
        return this.router.view;
    }
}

customElements.define('depend-view', DependView);
