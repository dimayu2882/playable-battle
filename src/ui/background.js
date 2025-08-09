import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createBackground(app) {
	const background = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.backgroundWide,
		label: labels.background,
		interactive: false,
		anchor: [0.5]
	}, onResizeHandler, true);
	const backgroundElement = background.getElement();
	
	setPosition();
	
	function setPosition() {
		const texW = backgroundElement.texture.width;
		const texH = backgroundElement.texture.height;
		
		const scaleX = app.renderer.width / texW;
		const scaleY = app.renderer.height / texH;
		const scale = Math.max(scaleX, scaleY);
		
		backgroundElement.scale.set(scale);
		backgroundElement.position.set(app.renderer.width / 2, app.renderer.height / 2);
	}
	
	function onResizeHandler() {
		setPosition();
	}
	
	return backgroundElement;
}
