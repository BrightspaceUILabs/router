/* eslint-disable max-classes-per-file */

import { LitElement, html, css } from 'lit-element';
import page from 'page';
import {
    RouterContextConsumer,
    RouterSearchQueryConsumer,
} from '../src/mixins.js';

class LinkBar extends LitElement {
    static get properties() {
        return {
            _backPeek: { attribute: false },
        };
    }

    static get styles() {
        return css`
            a {
                margin-right: 10px;
            }
        `;
    }

    render() {
        return html`
            <button @click=${() => page.show('/')}>Index</button>
            <button @click=${() => page.show('/about')}>About</button>
            <button @click=${() => page.show('/user/20?of=2')}>User</button>
            <button @click=${() => page.show('/user/10?of=1')}>
                User From Another Org
            </button>
        `;
    }
}
customElements.define('link-bar', LinkBar);

class TestParamConsumer extends RouterContextConsumer(LitElement) {
    render() {
        return html`Hello user id: ${this.ctx.params.id}`;
    }
}
customElements.define('d2l-test-param', TestParamConsumer);

class TestQueryConsumer extends RouterSearchQueryConsumer(LitElement) {
    render() {
        return html`org filter: ${this.query.get('of')}`;
    }
}
customElements.define('d2l-test-query', TestQueryConsumer);

class OrgFilterIncrementer extends RouterSearchQueryConsumer(LitElement) {
    incrementOf() {
        let orgFilter = Number.parseInt(this.query.get('of'), 10);
        orgFilter += 1;
        page.setSearchQuery('of', orgFilter);
    }

    render() {
        return html`<button @click=${this.incrementOf}>
            Increment Org Filter
        </button>`;
    }
}
customElements.define('d2l-inc-of', OrgFilterIncrementer);
