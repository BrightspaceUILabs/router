import { html } from 'lit-element';

export const loader = () => [
    {
        pattern: '/',
        view: () => html`<p>Index</p>`,
    },
];
