import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createLogo(app) {
	const logo = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.logo,
		label: labels.logo,
		anchor: [0.5]
	}, onResizeHandler, true);
	const logoElement = logo.getElement();
	
	setElementsPosition();
	function setElementsPosition() {
		logoElement.position.set(app.renderer.width - logoElement.width / 2 - 20, logoElement.height / 2 + 20);
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return logoElement;
}
