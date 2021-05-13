/* eslint-disable import/no-extraneous-dependencies */
import { fixture, html, expect, waitUntil } from '@open-wc/testing';
import '../src/d2l-router.js';
import page from 'page';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import './helpers/ContextMixin.js';

describe('d2l-route', () => {
    it('Should construct', () => {
        runConstructor('d2l-route');
    });

    it('Should fail if there is no parent router', async () => {
        try {
            await fixture(html`<d2l-route path="/"></d2l-route>`);
        } catch (e) {
            expect(e.message).to.equal('Route "/" expects a Router parent.');
        }
    });

    it('Should be active if our path is active and should render a slot', async () => {
        const routerEl = await fixture(html`
            <d2l-router base-path="/">
                <d2l-route path="/"></d2l-route>
            </d2l-router>
        `);
        const routeEl = routerEl.querySelector('d2l-route');
        waitUntil(() => routeEl._isActive);
        expect(routeEl._isActive).to.be.true;
        expect(routeEl.render().strings).to.eql(html`<slot></slot>`.strings);
    });

    it('Should be inactive if our path is inactive and should render nothing', async () => {
        const routerEl = await fixture(html`
            <d2l-router base-path="/">
                <d2l-route path="/anything"></d2l-route>
            </d2l-router>
        `);
        const routeEl = routerEl.querySelector('d2l-route');
        expect(routeEl._isActive).to.be.false;
        expect(routeEl.render().strings).to.be.undefined;
    });

    it('Should receive the Context from the observer mixin', async () => {
        const routerEl = await fixture(html`
            <d2l-router base-path="/">
                <d2l-route path="/">
                    <test-mixin></test-mixin>
                </d2l-route>
            </d2l-router>
        `);

        const el = routerEl.querySelector('test-mixin');
        waitUntil(() => el.ctx);
        expect(el.ctx).to.not.be.undefined;
    });

    it('Should update the component when the context changes', async () => {
        const routerEl = await fixture(html`
            <d2l-router base-path="/">
                <d2l-route path="/">
                    <test-mixin></test-mixin>
                </d2l-route>
            </d2l-router>
        `);

        const el = routerEl.querySelector('test-mixin');
        waitUntil(() => el.ctx);
        expect(el.ctx).to.not.be.undefined;

        page.setSearchQuery('test', 'hello');
        await el.updateComplete;

        expect(el.ctx.querystring).to.equal('test=hello');
    });
});
