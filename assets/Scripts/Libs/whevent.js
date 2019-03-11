/**
 * Event system
 * @author wheatup
 */

window.whevent = {
	// debug mode, the call will be printed by the logger
	debugMode: false,
	// the logger object, used for debug mode, if not assigned, use console.log instead
	logger: null,
	// the last event object that called
	lastEvent: null,

	_callStacks: {},


	// bind the event object
	bind: function(signal, func, self){
		if(!this._callStacks[signal]){
			this._callStacks[signal] = [];
		}
		this._callStacks[signal].push({func:func, self:self, once: false});
	},

	// make sure this is the first one get called
	bindPriority: function(signal, func, self){
		if(!this._callStacks[signal]){
			this._callStacks[signal] = [];
		}
		this._callStacks[signal].splice(0, 0, {func:func, self:self, once: false});
	},

	// destory the bind after it get called
	bindOnce: function(signal, func, self){
		if(!this._callStacks[signal]){
			this._callStacks[signal] = [];
		}
		this._callStacks[signal].push({func:func, self:self, once: true});
	},

	// make sure this is the first one get called destory the bind after it get called
	bindOncePriority: function(signal, func, self){
		if(!this._callStacks[signal]){
			this._callStacks[signal] = [];
		}
		this._callStacks[signal].splice(0, 0, {func:func, self:self, once: true});
	},

	// unbind the event
	unbind: function(signal, func, self){
		if(!this._callStacks[signal]){return;}
		for(var i = 0; i < this._callStacks[signal].length; i++){
			if(this._callStacks[signal][i].func === func && (!self || this._callStacks[signal][i].self === self)){
				this._callStacks[signal].splice(i, 1);
				return;
			}
		}

		if(this._callStacks[signal].length <= 0){
			this._callStacks[signal] = undefined;
		}
	},

	// destroy a signal
	destroy: function(signal){
		this._callStacks[signal] = undefined;
	},

	// dispatch the event
	call: function(signal, data){
		if(this.debugMode){
			if(!this.logger){
				this.logger = console.log;
			}
			this.logger('CALL: ' + signal, data);
		}
		if(this.lastEvent){
			this.lastEvent.signal = signal;
			this.lastEvent.data = data;
		}else{
			this.lastEvent = {signal: signal, data: data};
		}

		if(!this._callStacks[signal]){return;}
		var eves = this._callStacks[signal];
		for(var i = 0; i < eves.length; i++){
			if(eves[i].func){
				eves[i].func.call(eves[i].self, data);
				if(eves[i]){
					eves[i]._processed = true;
				}
			}
			if(eves[i].once){
				eves.splice(i, 1);
				i--;
			}
		}

		if(eves.length <= 0){
			this.destroy(signal);
		}
	}
};

// Aliases
whevent.on = whevent.bind;
whevent.onOnce = whevent.bindOnce;
whevent.onPriority = whevent.bindPriority;
whevent.onOncePriority = whevent.bindOncePriority;
whevent.off = whevent.unbind;
whevent.emit = whevent.call;

if(typeof module !== 'undefined'){
	module.exports = whevent;
}
