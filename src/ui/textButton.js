import gsap from 'gsap';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export default function createTextButton(app) {
	const enemiesText = new PixiElement({
		type: elementType.TEXT,
		text: 'MERGE HEROES',
		label: labels.textButton,
		style: {
			fontSize: 80,
			fontStyle: 'bold',
			fontWeight: 'normal',
			fill: 0xffffff,
			stroke: 0x000000,
			strokeThickness: 6
		},
		anchor: [0.5]
	}, onResizeHandler, true);
	const enemiesTextElement = enemiesText.getElement();
	
	gsap.to(enemiesTextElement.scale, {
		x: 1.1,
		y: 1.1,
		duration: 1,
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut',
	});
	
	setElementsPosition();
	function setElementsPosition() {
		enemiesTextElement.position.set(app.renderer.width / 2, app.renderer.height - enemiesTextElement.height - 20);
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return enemiesTextElement;
}
