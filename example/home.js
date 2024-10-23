import { html, LitElement } from 'lit';

export class Home extends LitElement {
	render() {
		return html`
			<h1>Home</h1>
			<p>Welcome home!</p>
		`;
	}
}

customElements.define('test-home', Home);
