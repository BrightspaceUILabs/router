import { LitElement, html } from 'lit-element';

class LazyView extends LitElement {
    render() {
        return html`<p>Lazy</p>`;
    }
}

customElements.define('lazy-view', LazyView);
