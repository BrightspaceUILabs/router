import './route-loader.js';
import { css, html, LitElement } from 'lit';
import { RouteReactor } from '../index.js';

export class App extends LitElement {
	static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-areas: 'nav main';
				grid-template-columns: 200px 1fr;
			}
			aside {
				grid-area: nav;
			}
			main {
				grid-area: main;
			}
		`;
	}

	constructor() {
		super();
		this.route = new RouteReactor(this);
	}

	render() {
		return html`
			<aside>
				<nav>
					<ul>
						<li><a href="/example/">Home</a></li>
						<li><a href="/example/people">People</a></li>
						<li><a href="/example/places">Places</a></li>
					</ul>
				</nav>
			</aside>
			<main>${this.route.renderView()}</main>
		`;
	}
}

customElements.define('test-app', App);
