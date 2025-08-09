import gsap from 'gsap';

import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createButtonTop() {
	const buttonTop = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.playNowButton,
		label: labels.buttonTop,
		interactive: true,
		buttonMode: true,
		cursor: 'pointer',
		anchor: [0.5]
	}, onResizeHandler, true);
	const buttonTopElement = buttonTop.getElement();
	
	gsap.to(buttonTopElement.scale, {
		x: 1.1,
		y: 1.1,
		duration: 1,
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut',
	});
	
	setElementsPosition();
	function setElementsPosition() {
		buttonTopElement.position.set(buttonTopElement.width / 2 + 20, buttonTopElement.height / 2 + 20);
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return buttonTopElement;
}
