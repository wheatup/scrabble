declare module whevent {
	export var debugMode: boolean;

	export var logger: function;

	export var lastEvent: any;

	/**
	 * Bind a signal with given function
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	@deprecated
	export function bind(signal: string, func: function, self?: any);

	/**
	 * Bind a signal with given function
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	export function on(signal: string, func: function, self?: any);

	/**
	 * Bind a signal with given function, once the signal is broadcasted, that function always get called first.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	@deprecated
	export function bindPriority(signal: string, func: function, self?: any);
	/**
	 * Bind a signal with given function, once the signal is broadcasted, that function always get called first.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	export function onPriority(signal: string, func: function, self?: any);

	/**
	 * Bind a signal with given function, once the signal is broadcasted, the binding between this signal and this function will be destroyed.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	@deprecated
	export function bindOnce(signal: string, func: function, self?: any);
	/**
	 * Bind a signal with given function, once the signal is broadcasted, the binding between this signal and this function will be destroyed.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	export function onOnce(signal: string, func: function, self?: any);

	/**
	 * Bind a signal with given function, once the signal is broadcasted, that function always get called first, after that the binding between this signal and this function will be destroyed.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	@deprecated

	export function bindOncePriority(signal: string, func: function, self?: any);
	/**
	 * Bind a signal with given function, once the signal is broadcasted, that function always get called first, after that the binding between this signal and this function will be destroyed.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	export function onOncePriority(signal: string, func: function, self?: any);

	/**
	 * Destroy the binding between given signal and function.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	@deprecated
	export function unbind(signal: string, func: function, self?: any);

	/**
	 * Destroy the binding between given signal and function.
	 * @param signal Signal
	 * @param func Function
	 * @param self This boject
	 */
	export function off(signal: string, func: function, self?: any);

	/**
	 * Destroy a signal, all bindings with this signal will be destroyed.
	 * @param signal Signal
	 */
	export function destroy(signal: string);

	/**
	 * Broadcast a signal, triggers all binded functions.
	 * @param signal Signal
	 */
	@deprecated
	export function call(signal: string, data?: any);

	/**
	 * Broadcast a signal, triggers all binded functions.
	 * @param signal Signal
	 */
	export function emit(signal: string, data?: any);
}
