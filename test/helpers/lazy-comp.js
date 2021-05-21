import { LitElement, html } from 'lit-element';

class LazyView extends LitElement {
    static get properties() {
        return {};
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('Connected lazy view');
    }

    render() {
        return html`<p>Hello</p>`;
    }
}

customElements.define('lazy-view', LazyView);
