import { LitElement, html } from 'lit-element';
import { Router } from '../../src/router.js';

class ParamQueryView extends LitElement {
    constructor() {
        super();

        this.router = new Router(
            this,
            [
                {
                    pattern: '/:test',
                    view: context =>
                        html`<p>
                            Index ${new URLSearchParams(context.search).test}
                            ${context.params.test}
                        </p>`,
                },
            ],
            { customPage: true, hashbang: true }
        );
    }

    render() {
        return this.router.view;
    }
}

customElements.define('param-query-view', ParamQueryView);
