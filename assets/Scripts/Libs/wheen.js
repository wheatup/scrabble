/**
 * Tween animation solution
 * @author wheatup
 */

class Wheen {
	constructor(target) {
		if (target) {
			this.apply(target);
		}

		this._running = false;
		this._tweenChain = [];
		this._chainIndex = 0;
		this._flags = {};
		this._lastUpdateTime = 0;
		this._completed = false;
		this._integrated = false;
		this._class = null;

		this._update = this._update.bind(this);

		// Cocos Creater integration
		if (typeof window !== 'undefined') {
			let cc = window.cc;
			if (typeof cc !== 'undefined' && cc.ENGINE_VERSION) {
				let ud = this._update;
				if (cc.Canvas.instance) {
					try {
						this._class = cc.Class({
							extends: cc.Component,
							update: ud
						});

						cc.Canvas.instance.node.addComponent(this._class);
						this._integrated = true;
					} catch (ex) {
						console.error(ex);
					}
				}
			}
		}
	}

	static stop(target) {
		if (target.__wheens__) {
			target.__wheens__.forEach(wheen => {
				wheen.stop();
			});
		}
	}

	static pause(target) {
		if (target.__wheens__) {
			target.__wheens__.forEach(wheen => {
				wheen.pause();
			});
		}
	}

	static resume(target) {
		if (target.__wheens__) {
			target.__wheens__.forEach(wheen => {
				wheen.resume();
			});
		}
	}

	static start(target) {
		if (target.__wheens__) {
			target.__wheens__.forEach(wheen => {
				wheen.start();
			});
		}
	}

	apply(target) {
		this.target = target;
		if (typeof target.__wheens__ === 'undefined' || !target.__wheens__) {
			target.__wheens__ = [];
		}
		target.__wheens__.push(this);
		return this;
	}

	from(args) {
		this._tweenChain.push({ args, type: 'from' });
		return this;
	}

	to(args, time, easing) {
		let chain = { args, time, easing, type: 'to' };
		this._tweenChain.push(chain);
		return this;
	}

	wait(time) {
		this._tweenChain.push({ time, type: 'wait', elapsedTime: 0 });
		return this;
	}

	setFlag(flag) {
		this._flags[flag] = this._tweenChain.length;
		return this;
	}

	loop(count, flag) {
		this._tweenChain.push({ count, flag, type: 'loop', currentLap: 0 });
		return this;
	}

	callFunc(func, self, ...args) {
		this._tweenChain.push({ func, self, args, type: 'callFunc' });
		return this;
	}

	start() {
		if (!this.target) {
			throw new Error('You have to assign the animation to a target!');
		}

		this._chainIndex = 0;
		this._running = true;
		this._lastUpdateTime = new Date().getTime();

		// Use the from value immediately
		this._tweenChain.forEach(chain => {
			if (chain.type === 'from') {
				assign(this.target, chain.args);
			}
		});

		if (!this._integrated) {
			window.requestAnimationFrame(() => this._update());
		}

		return this;
	}

	pause() {
		this._running = false;
		return this;
	}

	resume() {
		this._running = true;
		return this;
	}

	stop() {
		this._running = false;
		this._completed = true;
		this._remove();
		if (this._class) {
			cc.Canvas.instance.node.removeComponent(this._class);
		}
		return this;
	}

	_remove() {
		if (this.target.__wheens__) {
			let index = this.target.__wheens__.indexOf(this);
			if (index > -1) {
				this.target.__wheens__.splice(index, 1);
			}
			if (this.target.__wheens__.length <= 0) {
				delete this.target.__wheens__;
			}
		}
	}

	_update(deltaTime) {
		let dt = deltaTime;
		if (this._integrated && dt) {
			dt *= 1000;
		} else {
			dt = new Date().getTime() - this._lastUpdateTime;
		}

		let callImmediately = false;

		if (this._running && !this._completed) {
			let chain = this._tweenChain[this._chainIndex];
			if (!chain || !this.target || (this._integrated && this.target instanceof cc.Node && !this.target.isValid)) {
				this.stop();
			} else {
				switch (chain.type) {
					case 'from':
						this._chainIndex++;
						callImmediately = true;
						break;
					case 'to':
						if (chain.time <= 0) {
							assign(this.target, chain.args);
							this._chainIndex++;
						} else {
							if (!chain.org) {
								chain.org = {};
								for (let arg in chain.args) {
									chain.org[arg] = this.target[arg];
								}
							}

							if (!chain.elapsedTime) {
								chain.elapsedTime = dt;
							} else {
								chain.elapsedTime += dt;
							}

							if (chain.elapsedTime >= chain.time) {
								chain.elapsedTime = chain.time;
								assign(this.target, chain.args);
								this._chainIndex++;
							} else {
								if (!chain.easing) {
									chain.easing = Wheen.Easing.Linear;
								}

								for (let arg in chain.args) {
									if (chain.elapsedTime >= chain.time) {
										this.target[arg] = chain.args[arg];
									} else {
										this.target[arg] = chain.easing(chain.elapsedTime, chain.org[arg], chain.args[arg] - chain.org[arg], chain.time);
									}
								}
							}
						}
						break;
					case 'wait':
						chain.elapsedTime += dt;
						if (chain.elapsedTime > chain.time) {
							this._chainIndex++;
						}
						break;
					case 'loop':
						chain.currentLap++;
						if (!chain.count || chain.count <= 0 || chain.currentLap < chain.count) {
							let backtrack = (chain.flag && this._flags[chain.flag]) || 0;

							// reset the children's states
							for (let i = backtrack; i < this._chainIndex; i++) {
								let _chain = this._tweenChain[i];
								let _forWechat = _chain.elapsedTime;
								if (_chain.type === 'loop') {
									_chain.currentLap = 0;
								} else if (_chain.type === 'wait') {
									_chain.elapsedTime = 0;
								} else if (_chain.type === 'to') {
									_chain.elapsedTime = 0;
									delete _chain.org;
								}
								if (_forWechat) {
									_forWechat.toString();
								}
							}
							this._chainIndex = backtrack;
						} else {
							this._chainIndex++;
							callImmediately = true;
						}
						break;
					case 'callFunc':
						if (chain.func) {
							if (chain.self) {
								chain.func.call(chain.self, ...chain.args);
							} else {
								chain.func(...chain.args);
							}
							this._chainIndex++;
							break;
						}
				}
			}
		}

		this._lastUpdateTime += dt;
		if (callImmediately) {
			this._update();
		} else if (!this._completed) {
			if (!this._integrated) {
				window.requestAnimationFrame(() => this._update());
			}
		}
	}
}

Wheen.Easing = {
	Linear: function(t, s, e, i) {
		return (e * t) / i + s;
	},
	Quad: {
		easeIn: function(t, s, e, i) {
			return e * (t /= i) * t + s;
		},
		easeOut: function(t, s, e, i) {
			return -e * (t /= i) * (t - 2) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (t /= i / 2) < 1 ? (e / 2) * t * t + s : (-e / 2) * (--t * (t - 2) - 1) + s;
		}
	},
	Cubic: {
		easeIn: function(t, s, e, i) {
			return e * (t /= i) * t * t + s;
		},
		easeOut: function(t, s, e, i) {
			return e * ((t = t / i - 1) * t * t + 1) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (t /= i / 2) < 1 ? (e / 2) * t * t * t + s : (e / 2) * ((t -= 2) * t * t + 2) + s;
		}
	},
	Quart: {
		easeIn: function(t, s, e, i) {
			return e * (t /= i) * t * t * t + s;
		},
		easeOut: function(t, s, e, i) {
			return -e * ((t = t / i - 1) * t * t * t - 1) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (t /= i / 2) < 1 ? (e / 2) * t * t * t * t + s : (-e / 2) * ((t -= 2) * t * t * t - 2) + s;
		}
	},
	Quint: {
		easeIn: function(t, s, e, i) {
			return e * (t /= i) * t * t * t * t + s;
		},
		easeOut: function(t, s, e, i) {
			return e * ((t = t / i - 1) * t * t * t * t + 1) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (t /= i / 2) < 1 ? (e / 2) * t * t * t * t * t + s : (e / 2) * ((t -= 2) * t * t * t * t + 2) + s;
		}
	},
	Sine: {
		easeIn: function(t, s, e, i) {
			return -e * Math.cos((t / i) * (Math.PI / 2)) + e + s;
		},
		easeOut: function(t, s, e, i) {
			return e * Math.sin((t / i) * (Math.PI / 2)) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (-e / 2) * (Math.cos((Math.PI * t) / i) - 1) + s;
		}
	},
	Expo: {
		easeIn: function(t, s, e, i) {
			return 0 == t ? s : e * Math.pow(2, 10 * (t / i - 1)) + s;
		},
		easeOut: function(t, s, e, i) {
			return t == i ? s + e : e * (1 - Math.pow(2, (-10 * t) / i)) + s;
		},
		easeInOut: function(t, s, e, i) {
			return 0 == t ? s : t == i ? s + e : (t /= i / 2) < 1 ? (e / 2) * Math.pow(2, 10 * (t - 1)) + s : (e / 2) * (2 - Math.pow(2, -10 * --t)) + s;
		}
	},
	Circ: {
		easeIn: function(t, s, e, i) {
			return -e * (Math.sqrt(1 - (t /= i) * t) - 1) + s;
		},
		easeOut: function(t, s, e, i) {
			return e * Math.sqrt(1 - (t = t / i - 1) * t) + s;
		},
		easeInOut: function(t, s, e, i) {
			return (t /= i / 2) < 1 ? (-e / 2) * (Math.sqrt(1 - t * t) - 1) + s : (e / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + s;
		}
	},
	Elastic: {
		easeIn: function(t, s, e, i, n, h) {
			if (0 == t) return s;
			if (1 == (t /= i)) return s + e;
			if ((h || (h = 0.3 * i), !n || n < Math.abs(e))) {
				n = e;
				var a = h / 4;
			} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
			return -n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) + s;
		},
		easeOut: function(t, s, e, i, n, h) {
			if (0 == t) return s;
			if (1 == (t /= i)) return s + e;
			if ((h || (h = 0.3 * i), !n || n < Math.abs(e))) {
				n = e;
				var a = h / 4;
			} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
			return n * Math.pow(2, -10 * t) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) + e + s;
		},
		easeInOut: function(t, s, e, i, n, h) {
			if (0 == t) return s;
			if (2 == (t /= i / 2)) return s + e;
			if ((h || (h = i * (0.3 * 1.5)), !n || n < Math.abs(e))) {
				n = e;
				var a = h / 4;
			} else a = (h / (2 * Math.PI)) * Math.asin(e / n);
			return t < 1
				? n * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) * -0.5 + s
				: n * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * i - a) * (2 * Math.PI)) / h) * 0.5 + e + s;
		}
	},
	Back: {
		easeIn: function(t, s, e, i, n) {
			return null == n && (n = 1.70158), e * (t /= i) * t * ((n + 1) * t - n) + s;
		},
		easeOut: function(t, s, e, i, n) {
			return null == n && (n = 1.70158), e * ((t = t / i - 1) * t * ((n + 1) * t + n) + 1) + s;
		},
		easeInOut: function(t, s, e, i, n) {
			return null == n && (n = 1.70158), (t /= i / 2) < 1 ? (e / 2) * (t * t * ((1 + (n *= 1.525)) * t - n)) + s : (e / 2) * ((t -= 2) * t * ((1 + (n *= 1.525)) * t + n) + 2) + s;
		}
	},
	Bounce: {
		easeIn: function(t, s, e, i) {
			return e - Easing.Bounce.easeOut(i - t, 0, e, i) + s;
		},
		easeOut: function(t, s, e, i) {
			return (t /= i) < 1 / 2.75
				? e * (7.5625 * t * t) + s
				: t < 2 / 2.75
				? e * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + s
				: t < 2.5 / 2.75
				? e * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + s
				: e * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + s;
		},
		easeInOut: function(t, s, e, i) {
			return t < i / 2 ? 0.5 * Easing.Bounce.easeIn(2 * t, 0, e, i) + s : 0.5 * Easing.Bounce.easeOut(2 * t - i, 0, e, i) + 0.5 * e + s;
		}
	}
};

// TODO: Use lodash .set function
function assign(target, source) {
	Object.assign(target, source);
}

if (typeof module !== 'undefined') {
	module.exports = Wheen;
}

window.Wheen = Wheen;
