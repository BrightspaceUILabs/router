/* eslint-disable import/no-extraneous-dependencies */
import { fixture, html, expect } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import '../src/d2l-router.js';

describe('d2l-router', () => {
  it('Should construct', () => {
    runConstructor('d2l-router');
  });

  it('Should create a list of routes', async () => {
    const el = await fixture(html`
      <d2l-router base-path="/">
        <d2l-route path="/"></d2l-route>
        <d2l-route path="/users"></d2l-route>
        <d2l-route path="/about"></d2l-route>
      </d2l-router>
    `);
    expect(el.routes.map(route => route.path)).to.eql([
      '/',
      '/users',
      '/about',
    ]);
  });
});
