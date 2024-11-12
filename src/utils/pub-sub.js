export default class PubSub {
	constructor() {
		this._listeners = new Map();
		this._hasTriggered = false;
		this._previousData = null;
	}

	clear() {
		this._listeners.clear();
		this._hasTriggered = false;
		this._previousData = null;
	}

	getListenersCount() {
		return this._listeners.size;
	}

	publish(data) {
		this._listeners.forEach(listener => listener(data));
		this._hasTriggered = true;
		this._previousData = data;
	}

	subscribe(listener, initialize) {
		this._listeners.set(listener, listener);
		if (this._hasTriggered) {
			initialize?.(this._previousData);
		}
	}

	unsubscribe(listener) {
		this._listeners.delete(listener);
	}
}
