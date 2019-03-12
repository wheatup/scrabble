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

	/**
	 * Switch the parent of the node without changing the transformation
	 * @param node target node
	 * @param newParent 
	 */
	static switchParent(node, newParent) {
		let localPos = (node.parent || node).convertToWorldSpaceAR(node.getPosition());
		let worldPos = newParent.convertToNodeSpaceAR(localPos);

		let rotationAttr = (typeof node.rotation === 'undefined' ? 'angle' : 'rotation');
		let localScaleX = 1;
		let localScaleY = 1;
		let localAngleX = 0;
		let localAngleY = 0;
		for (let parent = node; parent; parent = parent.parent) {
			localScaleX *= parent.scaleX;
			localScaleY *= parent.scaleY;
			localAngleX += parent[rotationAttr + 'X'];
			localAngleY += parent[rotationAttr + 'Y'];
		}

		let worldScaleX = 1;
		let worldScaleY = 1;
		let worldAngleX = 0;
		let worldAngleY = 0;
		for (let parent = newParent; parent; parent = parent.parent) {
			worldScaleX /= parent.scaleX;
			worldScaleY /= parent.scaleY;
			worldAngleX -= parent[rotationAttr + 'X'];
			worldAngleY -= parent[rotationAttr + 'Y'];
		}

		node.setParent(newParent);
		node[rotationAttr+'X'] = localAngleX + worldAngleX;
		node[rotationAttr+'Y'] = localAngleY + worldAngleY;
		node.setScale(localScaleX * worldScaleX, localScaleY * worldScaleY);
		node.setPosition(worldPos);
	}
}

window.Utils = Utils;
