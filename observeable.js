export default class Observable {
	constructor() {
		this._observers = new Map();
		this._hasTriggered = false;
		this._previousData = null;
	}

	clear() {
		this._observers.clear();
	}

	notify(data) {
		this._observers.forEach(observer => observer(data));
		this._hasTriggered = true;
		this._previousData = data;
	}

	subscribe(observer) {
		this._observers.set(observer, observer);
		if (this._hasTriggered) {
			observer(this._previousData);
		}
	}

	unsubscribe(observer) {
		this._observers.delete(observer);
	}
}
