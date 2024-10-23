import { html, LitElement } from 'lit';

export const people = [
	{
		id: 1,
		name: 'Bill Nye',
		type: 'scientist',
		url: 'https://en.wikipedia.org/wiki/Bill_Nye',
	},
	{
		id: 2,
		name: 'Sally Field',
		type: 'actor',
		url: 'https://en.wikipedia.org/wiki/Sally_Field',
	},
	{
		id: 3,
		name: 'Marie Curie',
		type: 'scientist',
		url: 'https://en.wikipedia.org/wiki/Marie_Curie',
	},
	{
		id: 4,
		name: 'Chien-Shiung Wu',
		type: 'scientist',
		url: 'https://en.wikipedia.org/wiki/Chien-Shiung_Wu',
	},
	{
		id: 5,
		name: 'Albert Einstein',
		type: 'scientist',
		url: 'https://en.wikipedia.org/wiki/Albert_Einstein',
	},
	{
		id: 6,
		name: 'Halle Berry',
		type: 'actor',
		url: 'https://en.wikipedia.org/wiki/Halle_Berry',
	},
	{
		id: 7,
		name: 'Chadwick Boseman',
		type: 'actor',
		url: 'https://en.wikipedia.org/wiki/Chadwick_Boseman',
	},
	{
		id: 8,
		name: 'Elliot Page',
		type: 'actor',
		url: 'https://en.wikipedia.org/wiki/Elliot_Page',
	},
];

const filters = [
	{ id: 'all', name: 'All' },
	{ id: 'actor', name: 'Actors' },
	{ id: 'scientist', name: 'Scientists' },
];

export class People extends LitElement {
	static get properties() {
		return {
			filter: { type: String },
		};
	}

	constructor() {
		super();
		this.filter = 'all';
	}

	render() {
		const filteredPeople = people.filter(p => {
			if (this.filter === 'all') return true;
			return p.type === this.filter;
		});
		return html`
			<h1>People</h1>
			<label>
				Filter:
				<select @change="${this._applyFilter}">
					${filters.map(f => html`<option value="${f.id}" .selected="${f.id === this.filter}">${f.name}</option>`)}
				</select>
			</label>
			<ul>
				${filteredPeople.map(p => html`<li><a href="/example/people/${p.id}">${p.name}</a></li>`)}
			</ul>
		`;
	}

	_applyFilter(e) {
		this.dispatchEvent(
			new CustomEvent('filter-change', {
				detail: {
					value: e.target.options[e.target.selectedIndex].value,
				},
			})
		);
	}
}

customElements.define('test-people', People);
