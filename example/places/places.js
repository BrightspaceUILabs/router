import { html, LitElement } from 'lit';

export const places = [
	{
		id: 1,
		name: 'Burj Khalifa',
		image: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Burj_Khalifa.jpg/240px-Burj_Khalifa.jpg',
		url: 'https://en.wikipedia.org/wiki/Burj_Khalifa',
	},
	{
		id: 2,
		name: 'Victoria Falls',
		image: 'https://www.cruisemapper.com/images/ports/10130-bbb021f991.jpg',
		url: 'https://en.wikipedia.org/wiki/Victoria_Falls',
	},
	{
		id: 3,
		name: 'Great Wall of China',
		image: 'https://cdn.getyourguide.com/img/location/5457947b8a235.jpeg/92.jpg',
		url: 'https://en.wikipedia.org/wiki/Great_Wall_of_China',
	},
	{
		id: 4,
		name: 'Machu Picchu',
		image: 'https://www.intrepidtravel.com/adventures/wp-content/uploads/2018/06/1.-Intrepid-Travel-peru_machupicchu.jpg',
		url: 'https://en.wikipedia.org/wiki/Machu_Picchu',
	},
];

export class Places extends LitElement {
	render() {
		return html`
			<h1>Places</h1>
			<ul>
				${places.map(p => html`<li><a href="/example/places/${p.id}">${p.name}</a></li>`)}
			</ul>
		`;
	}
}

customElements.define('test-places', Places);
