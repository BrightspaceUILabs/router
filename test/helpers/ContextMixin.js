import { LitElement, html } from 'lit-element';
import { RouterContextConsumer } from '../../src/mixins.js';

export class TestContextMixin extends RouterContextConsumer(LitElement) {
    render() {
        return html`Test Component`;
    }
}

customElements.define('test-mixin', TestContextMixin);
