/* eslint-disable func-names */
/* eslint-disable max-classes-per-file */
/*
    d2l-router
    A LitElement component that wraps Page.js
*/

import {LitElement} from 'lit-element';
import {html, nothing} from 'lit-html';
import page from 'page';

// Observe a context
page.observeContext = function(callback) {
    if (!this._contextObservers) this._contextObservers = [];
    this._contextObservers.push(callback); 
}
// Update the observers
page.updateObservers = function(ctx) {
    if (!this._contextObservers) return;
    this._contextObservers.forEach( observerCallback => observerCallback(ctx))
}

let routerConnected = () => {};
const routerPromise = new Promise(res => { routerConnected = res; });

class D2LRouter extends LitElement {
    static get properties() {
        return {
            basePath: {type: String, attribute: 'base-path'},
        }
    }

    constructor() {
        super();
        this.basePath = '';
        this._type = 'd2l-router';
        this.routes = [];
    }

    firstUpdated() {
        routerPromise.then(() => {
            page.start();
        })
    }

    connectedCallback() {
        super.connectedCallback();
        page.base(this.basePath);
        page((ctx, next) => { // clears the other components
            this.routes.forEach( routeEl => {
                // eslint-disable-next-line no-param-reassign
                routeEl._isActive = false;
                ctx.handled = true; // prevents page refresh
            })
            next();
        })
        routerConnected();
    }


    render() {
        return html`<slot></slot>`;
    }
}

class D2LRoute extends LitElement {
    static get properties() {
        return {
            path: {type: String, attribute: true},
            _isActive: {attribue: false}
        }
    }

    constructor() {
        super();
        this._isActive = false;
        this._pathProperties = [];
    }

    connectedCallback() {
        // before first render
        super.connectedCallback();
        routerPromise.then(() => {
            let current = this.parentElement;
            let found;
            while (current !== document.body && !found) {
                if (current._type && current._type === 'd2l-router') {
                    found = current;
                } else {
                    current = current.parentElement;
                }
            }
            if (found) {
                found.routes.push(this);
            } else {
                throw(new Error("d2l-route must be the child of d2l-router"));
            }
    
            page(this.path, (ctx, next) => {
                this._isActive = true;
                page.updateObservers(ctx);
                next();
            });
        })
    }

    render() {
        return this._isActive ? 
            html`<slot></slot>` :
            nothing;
    }
}

customElements.define('d2l-route', D2LRoute);
customElements.define('d2l-router', D2LRouter);

export const router = page;