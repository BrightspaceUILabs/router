import { html } from 'lit';

export function loader() {
	return [
		{
			pattern: '/places',
			loader: () => import('./places.js'),
			view: () => html`<test-places></test-places>`,
		},
		{
			pattern: '/places/:id',
			loader: () => import('./place.js'),
			view: ctx =>
				html`<test-place place-id="${ctx.params.id}"></test-place>`,
		},
	];
}
