/* eslint-disable no-new */
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { Router } from '../src/router.js';

import './helpers/main-view.js';
import './helpers/loader-view.js';
import './helpers/depend-view.js';
import './helpers/param-query-view.js';

let lastPage = {};

describe('Router', () => {
    beforeEach(() => {
        Router._hasConstructed = false;
    });

    afterEach(() => {
        lastPage.stop();
    });

    // test construction
    it('Should construct the router', () => {
        const router = new Router([], [], { customPage: true, hashbang: true });
        lastPage = router.page;
        expect(router).to.exist;
    });

    // test can't have multiple routers
    it('Should only construct one router', () => {
        try {
            const router = new Router([], [], {
                customPage: true,
                hashbang: true,
            });
            lastPage = router.page;
            new Router([], [], { customPage: true, hashbang: true });
        } catch (e) {
            expect(e.message).to.equal('May not construct multiple routers.');
        }
    });

    // test renders active view
    it('Should show the active template associated with a route', async () => {
        const el = await fixture(html`<main-view></main-view>`);
        await el.updateComplete;
        lastPage = el.router.page;

        const p = el.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Index');
    });

    // test component changes view
    it('Should change the route on redirect', async () => {
        const el = await fixture(html`<main-view></main-view>`);
        await el.updateComplete;
        lastPage = el.router.page;

        let p = el.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Index');

        lastPage.redirect('#!/user');
        await waitUntil(
            () => el.shadowRoot.querySelector('p').innerText === 'User'
        );
        p = el.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('User');
    });

    // test component changes view
    it('Should load routes from separate files', async () => {
        const el = await fixture(html`<loader-view></loader-view>`);
        await el.updateComplete;
        lastPage = el.router.page;

        lastPage.redirect('/');
        await waitUntil(
            () => el.shadowRoot.querySelector('p').innerText === 'Index'
        );
        let p = el.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Index');

        lastPage.redirect('/user');
        await waitUntil(
            () => el.shadowRoot.querySelector('p').innerText === 'User'
        );
        p = el.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('User');
    });

    // test component changes view
    it('Should lazy import route dependencies', async () => {
        expect(customElements.get('lazy-view')).to.not.exist;

        const el = await fixture(html`<depend-view></depend-view>`);
        await el.updateComplete;
        lastPage = el.router.page;

        lastPage.redirect('/');
        await waitUntil(() => customElements.get('lazy-view'));

        expect(customElements.get('lazy-view')).to.exist;
    });

    // test router passes context
    it('Should pass the context on redirect', async () => {
        const el = await fixture(html`<param-query-view></param-query-view>`);
        await el.updateComplete;
        lastPage = el.router.page;

        lastPage.redirect('/hello?test=hello');
        await waitUntil(() => el.shadowRoot.querySelector('p'));

        expect(el.shadowRoot.querySelector('p').innerText).to.equal(
            'Index hello hello'
        );
    });
});
