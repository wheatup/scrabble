/**
 * Util class
 * @author wheatup
 */

class Utils {
	/**
	 * Interpolate between two colors
	 * @param color1 starting color
	 * @param color2 target color
	 * @param factor a number between 0 to 1 
	 */
	static interpolateColor(color1, color2, factor) {
		var result = { r: 255, g: 255, b: 255, a: 255 };
		result.r = Math.round(color1.r + factor * (color2.r - color1.r));
		result.g = Math.round(color1.g + factor * (color2.g - color1.g));
		result.b = Math.round(color1.b + factor * (color2.b - color1.b));
		result.a = Math.round(color1.a + factor * (color2.a - color1.a));
		return result;
	}

	/**
	 * Calculate distant between two points.
	 * @param vec1 point1
	 * @param vec2 point2
	 */
	static distance(vec1, vec2) {
		return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
	}
}

window.Utils = Utils;
