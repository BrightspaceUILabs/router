import { LitElement, html } from 'lit';
import { RouteReactor } from '../../RouteReactor.js';

class ParamQueryView extends LitElement {
    static get properties() {
        return {
            params: { type: Object, attribute: false },
            search: { type: Object, attribute: false },
        };
    }

    constructor() {
        super();
        this.route = new RouteReactor(this);
    }

    render() {
        return html`<p>
            Param test: ${this.route.params.test}, Search Test:
            ${this.route.search.test}
        </p>`;
    }
}

customElements.define('route-view', ParamQueryView);
