import './helpers/main-view.js';
import './helpers/param-query-view.js';
import { aTimeout, expect, fixture, html, waitUntil } from '@brightspace-ui/testing';
import { navigate, registerRoutes, RouterTesting } from '../index.js';
import { loader as load1 } from './helpers/route-loader-1.js';
import { loader as load2 } from './helpers/route-loader-2.js';

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
			{
				pattern: '/param/:foo/:bar',
				view: ctx =>
					html`<p>
						${ctx.params.foo}, ${ctx.params.bar}, ${ctx.search.test}
					</p>`,
			},
			{
				pattern: '/search',
				view: ctx => html`<p>${ctx.search.test}</p>`,
			},
			{
				pattern: '/entry-prop',
				view: ctx => html`<p>${ctx.options.main}</p>`,
			},
			{
				pattern: '/entry-this',
				view() {
					return html`<p>${this['main-prop']}</p>`;
				},
			},
			load1,
			load2,
		],
		{ hashbang: true, customPage: true }
	);
};

describe('Router', () => {
	beforeEach(async() => {
		initRouter();
		entryPoint = await fixture(
			html`<main-view main-prop="Passed"></main-view>`
		);
		navigate('/');
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

	it('Should show the active template associated with a route', async() => {
		await entryPoint.updateComplete;
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Index');
	});

	it('Should change the route on redirect', async() => {
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		let p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Index');

		navigate('/user');
		await waitUntil(
			() => entryPoint.shadowRoot.querySelector('p').innerText === 'User'
		);
		p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('User');
	});

	it('Should load routes from separate files', async() => {
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		navigate('/load1');
		await waitUntil(
			() =>
				entryPoint.shadowRoot.querySelector('p').innerText === 'Load 1'
		);
		let p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Load 1');

		navigate('/load2');
		await waitUntil(
			() =>
				entryPoint.shadowRoot.querySelector('p').innerText === 'Load 2'
		);
		p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Load 2');
	});

	it('Should lazy import route dependencies', async() => {
		navigate('/lazy');

		await waitUntil(() => customElements.get('lazy-view'));
		expect(customElements.get('lazy-view')).to.exist;
	});

	it('Should pass the context on redirect', async() => {
		navigate('/param/hello?test=hello');
		await waitUntil(() =>
			entryPoint.shadowRoot.querySelector('route-view')
		);
		const paramQueryEl = entryPoint.shadowRoot.querySelector('route-view');

		await waitUntil(() => paramQueryEl.shadowRoot.querySelector('p'));

		expect(paramQueryEl.shadowRoot.querySelector('p').innerText).to.equal(
			'Param test: hello, Search Test: hello'
		);
	});

	it('Should pass parameters', async() => {
		navigate('/param/beep/boop');
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.eql('beep, boop,');
	});

	it('Should pass parameters with search param at the end', async() => {
		navigate('/param/zip/zap?test=zop');
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.eql('zip, zap, zop');
	});

	it('Should pass a search parameter without any url params', async() => {
		navigate('/search?test=test');
		await waitUntil(() => entryPoint.shadowRoot.querySelector('p'));
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.eql('test');
	});

	it('Should redirect', async() => {
		navigate('/redirect');
		await entryPoint.updateComplete;
		await aTimeout(50);
		await waitUntil(
			() => entryPoint.shadowRoot.querySelector('p') !== null
		);
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('User');
		expect(window.location.pathname).to.include('/user');
	});

	it('Should receive passed values from entry-point', async() => {
		navigate('/entry-prop');
		await entryPoint.updateComplete;
		await waitUntil(
			() => entryPoint.shadowRoot.querySelector('p') !== null
		);
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Passed');
	});

	it('Should receive entry-point as this', async() => {
		navigate('/entry-this');
		await entryPoint.updateComplete;
		await waitUntil(
			() => entryPoint.shadowRoot.querySelector('p') !== null
		);
		const p = entryPoint.shadowRoot.querySelector('p').innerText;
		expect(p).to.equal('Passed');
	});
});
