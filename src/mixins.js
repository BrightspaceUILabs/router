/* eslint-disable max-classes-per-file */

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import {router} from './d2l-router.js';

// Mixin for listening to router context changes
export const RouterContextConsumer = dedupeMixin(superclass => 
    class extends superclass {

        static get properties() {
            return {
                ctx: {type: Object, attribute: true}
            }
        }

        constructor() {
            super();
            router.observeContext((ctx) => {
                this.ctx = ctx;
            });
        }
    }
);

// Mixin for listening to router context changes
export const RouterParamConsumer = dedupeMixin(superclass => 
    class extends superclass {

        static get properties() {
            return {
                params: {type: Object, attribute: true}
            }
        }

        constructor() {
            super();
            router.observeContext((ctx) => {
                this.params = ctx.params;
            });
        }
    }
);

// Mixin for listening to router context changes
export const RouterSearchQueryConsumer = dedupeMixin(superclass => 
    class extends superclass {

        static get properties() {
            return {
                query: {type: Object, attribute: true}
            }
        }

        constructor() {
            super();
            router.observeContext((ctx) => {
                this.query = new URLSearchParams(ctx.querystring);
            });
        }
    }
);