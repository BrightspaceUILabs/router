/* eslint-disable max-classes-per-file */

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { router } from './d2l-router.js';

// Listens to page context changes
export const RouterContextConsumer = dedupeMixin(
  superclass =>
    class extends superclass {
      static get properties() {
        return {
          ctx: { type: Object, attribute: true },
        };
      }

      constructor() {
        super();
        router.observeContext(ctx => {
          this.ctx = ctx;
        });
      }
    }
);

// Listens for URL Parameter changes
export const RouterParamConsumer = dedupeMixin(
  superclass =>
    class extends superclass {
      static get properties() {
        return {
          params: { type: Object, attribute: true },
        };
      }

      constructor() {
        super();
        router.observeContext(ctx => {
          this.params = ctx.params;
        });
      }
    }
);

// Listens for search query changes
export const RouterSearchQueryConsumer = dedupeMixin(
  superclass =>
    class extends superclass {
      static get properties() {
        return {
          query: { type: Object, attribute: true },
        };
      }

      constructor() {
        super();
        router.observeContext(ctx => {
          this.query = new URLSearchParams(ctx.querystring);
        });
      }
    }
);
