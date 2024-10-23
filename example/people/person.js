import { html, LitElement } from 'lit';
import { people } from './people.js';

export class Person extends LitElement {
	static get properties() {
		return {
			personId: { attribute: 'person-id', type: Number },
		};
	}

	render() {
		const person = people.find(p => p.id === this.personId);
		if (person === undefined) return html`<p>Person not found</p>`;
		return html`
			<h1>Person: ${person.name}</h1>
			<p><a href="${person.url}">Wikipedia</a></p>
		`;
	}
}

customElements.define('test-person', Person);
