import { LitElement } from 'lit-element';
import { Router } from '../../src/router.js';
import { loader as indexLoader } from './route-loader-1.js';
import { loader as userLoader } from './route-loader-2.js';

class LoaderView extends LitElement {
    constructor() {
        super();

        this.router = new Router(this, [indexLoader, userLoader], {
            customPage: true,
            hashbang: true,
        });
    }

    render() {
        return this.router.view;
    }
}

customElements.define('loader-view', LoaderView);
