import { PixiElement } from '../utils/PixiElement.js';
import { elementType } from '../common/enums.js';

export default function createTitleUser() {
	const userTitle = new PixiElement({
		type: elementType.TEXT,
		text: 'You'.toUpperCase(),
		style: {
			fontSize: 70,
			fontStyle: 'bold',
			fontWeight: 'normal',
			fill: 0xc81f12,
			stroke: 0x000000,
			strokeThickness: 6
		},
		anchor: [0.5]
	}, onResizeHandler, true);
	const userTitleElement = userTitle.getElement();
	userTitleElement.rotation = -Math.PI / 2;
	
	setElementsPosition();
	function setElementsPosition() {
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return userTitleElement;
}
