import { html } from 'lit-element';

export const loader = () => [
    {
        pattern: '/user',
        view: () => html`<p>User</p>`,
    },
];
