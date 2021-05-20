/* eslint-disable no-return-assign */
/* eslint-disable no-new */
import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { registerRoutes, redirect, RouterTesting } from '../src/router.js';
import { loader as load1 } from './helpers/route-loader-1.js';
import { loader as load2 } from './helpers/route-loader-2.js';
import './helpers/main-view.js';
import './helpers/param-query-view.js';

let entryPoint;

const initRouter = () => {
    registerRoutes(
        [
            {
                pattern: '/',
                view: () => html`<p>Index</p>`,
            },
            {
                pattern: '/redirect',
                to: '/user',
            },
            {
                pattern: '/user',
                view: () => html`<p>User</p>`,
            },
            {
                pattern: '/lazy',
                loader: () => import('./helpers/lazy-comp.js'),
                view: () => html`<lazy-view></lazy-view>`,
            },
            {
                pattern: '/param/:test',
                view: () => html`<route-view></route-view>`,
            },
            load1,
            load2,
        ],
        { hashbang: true, customPage: true }
    );
};

describe('Router', () => {
    beforeEach(async () => {
        initRouter();
        entryPoint = await fixture(html`<main-view></main-view>`);
        redirect('/');
    });

    afterEach(() => {
        RouterTesting.reset();
    });

    it('Should only construct one router', () => {
        try {
            initRouter();
        } catch (e) {
            expect(e.message).to.equal('May not construct multiple routers.');
        }
    });

    it('Should show the active template associated with a route', async () => {
        await entryPoint.updateComplete;
        await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
        const p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Index');
    });

    it('Should change the route on redirect', async () => {
        let p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Index');

        redirect('/user');
        await waitUntil(
            () => entryPoint.shadowRoot.querySelector('p').innerText === 'User'
        );
        p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('User');
    });

    it('Should load routes from separate files', async () => {
        redirect('/load1');
        await waitUntil(
            () =>
                entryPoint.shadowRoot.querySelector('p').innerText === 'Load 1'
        );
        let p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Load 1');

        redirect('/load2');
        await waitUntil(
            () =>
                entryPoint.shadowRoot.querySelector('p').innerText === 'Load 2'
        );
        p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('Load 2');
    });

    it('Should lazy import route dependencies', async () => {
        redirect('/lazy');

        await waitUntil(() => customElements.get('lazy-view'));
        expect(customElements.get('lazy-view')).to.exist;
    });

    it('Should pass the context on redirect', async () => {
        redirect('/param/hello?test=hello');
        await waitUntil(() =>
            entryPoint.shadowRoot.querySelector('route-view')
        );
        const paramQueryEl = entryPoint.shadowRoot.querySelector('route-view');

        console.log(entryPoint);
        await waitUntil(() => paramQueryEl.shadowRoot.querySelector('p'));

        expect(paramQueryEl.shadowRoot.querySelector('p').innerText).to.equal(
            'Param test: hello, Search Test: hello'
        );
    });

    it('Should redirect', async () => {
        redirect('/redirect');
        await entryPoint.updateComplete;
        await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
        const p = entryPoint.shadowRoot.querySelector('p').innerText;
        expect(p).to.equal('User');
        expect(window.location.pathname).to.include('/user');
    });
});