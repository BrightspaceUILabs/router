import { LitElement } from 'lit';
import { RouteReactor } from '../../index.js';

class MainView extends LitElement {
	static get properties() {
		return {
			'main-prop': { type: String, attribute: true },
		};
	}

	constructor() {
		super();
		this.route = new RouteReactor(this);
	}

	render() {
		return this.route.renderView({ main: this['main-prop'] });
	}
}

customElements.define('main-view', MainView);
