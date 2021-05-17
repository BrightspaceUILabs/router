import { html, LitElement } from 'lit-element';

export class Home extends LitElement {
    render() {
        return html`
            <h1>Home</h1>
            <p>Welcome home!</p>
        `;
    }
}

customElements.define('test-home', Home);
