import { html } from 'lit';

export const loader = () => [
	{
		pattern: '/load2',
		view: () => html`<p>Load 2</p>`,
	},
];
