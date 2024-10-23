import { html, LitElement } from 'lit';
import { places } from './places.js';

export class Place extends LitElement {
	static get properties() {
		return {
			placeId: { attribute: 'place-id', type: Number },
		};
	}

	render() {
		const place = places.find(p => p.id === this.placeId);
		if (place === undefined) return html`<p>Place not found</p>`;
		return html`
			<h1>Place: ${place.name}</h1>
			<p>Name: <a href="${place.url}">Wikipedia</a></p>
			<img src="${place.image}" alt="${place.name}" />
		`;
	}
}

customElements.define('test-place', Place);
