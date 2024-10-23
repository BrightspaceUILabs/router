import { html, LitElement } from 'lit';

class LazyView extends LitElement {
	static get properties() {
		return {};
	}

	render() {
		return html`<p>Hello</p>`;
	}
}

customElements.define('lazy-view', LazyView);
