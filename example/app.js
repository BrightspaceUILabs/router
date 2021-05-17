import { css, html, LitElement } from 'lit-element';
import { loader as routeLoader } from './route-loader.js';
import { Router } from '../src/router.js';

export class App extends LitElement {
    static get styles() {
        return css`
            :host {
                display: grid;
                grid-template-areas: 'nav main';
                grid-template-columns: 200px 1fr;
            }
            aside {
                grid-area: nav;
            }
            main {
                grid-area: main;
            }
        `;
    }

    constructor() {
        super();
        this.router = new Router(this, routeLoader);
    }

    render() {
        return html`
            <aside>
                <nav>
                    <ul>
                        <li><a href="/example/">Home</a></li>
                        <li><a href="/example/people">People</a></li>
                        <li><a href="/example/places">Places</a></li>
                    </ul>
                </nav>
            </aside>
            <main>${this.router.view}</main>
        `;
    }
}

customElements.define('test-app', App);
