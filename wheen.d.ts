declare interface EasingFunction{

}

declare class Wheen {
	/**
	 * create a new animation with given target.
	 * @param target target
	 */
	constructor(target?: any);

	/**
	 * apply the animation to the target.
	 * @param target target
	 */
	apply(target: any): Wheen;

	/**
	 * set the starting point.
	 * @param args attributes for starting point
	 */
	from(args: any): Wheen;

	/**
	 * lerp to given attributes
	 * @param args target attributes
	 * @param time total time, milliseconds
	 * @param easing easing function
	 * 
	 */
	to(args: any, time: number, easing?: EasingFunction): Wheen;

	/**
	 * wait a specific time
	 * @param time target attributes
	 */
	wait(time: number): Wheen;

	/**
	 * set a flag for looping
	 * @param flag flag name
	 */
	setFlag(flag: string|number|symbol): Wheen;

	/**
	 * loop animation
	 * @param count loop count, if less or equal 0, it's infinite
	 * @param flag flag name
	 */
	loop(count?: number, flag?: string|number|symbol): Wheen;

	/**
	 * call a function
	 * @param func the function need to be called
	 * @param self this context
	 * @param args arguments
	 */
	callFunc(func: Function, self?: any, ...args: any): Wheen;

	/**
	 * start the animation
	 */
	start();

	/**
	 * pause the animation
	 */
	pause();

	/**
	 * resume the animation
	 */
	resume();

	/**
	 * stop the animation
	 */
	stop();

	/**
	 * stop all animations from an object
	 * @param target target
	 */
	static stop(target: any);

	/**
	 * start all animations from an object
	 * @param target target
	 */
	static start(target: any);

	/**
	 * pause all animations from an object
	 * @param target target
	 */
	static pause(target: any);

	/**
	 * resume all animations from an object
	 * @param target target
	 */
	static resume(target: any);

	static Easing: {
		static Linear: EasingFunction;

		static Quad: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Cubic: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Quart: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Quint: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Sine: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Expo: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Circ: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Elastic: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Back: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}

		static Bounce: {
			static easeIn: EasingFunction;
			static easeOut: EasingFunction;
			static easeInOut: EasingFunction;
		}
	}
}