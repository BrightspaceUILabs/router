import { html } from 'lit';

export const loader = () => [
	{
		pattern: '/load1',
		view: () => html`<p>Load 1</p>`,
	},
];
