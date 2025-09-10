import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType } from '../common/enums.js';

export default function createTitleEnemies() {
	const titleEnemies = new PixiElement({
		type: elementType.CONTAINER,
	}, onResizeHandler, true);
	const titleEnemiesElement = titleEnemies.getElement();
	
	const enemiesLogo = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.enemiesIcon,
		anchor: [0.5],
		scale: [0.5]
	});
	const enemiesLogoElement = enemiesLogo.getElement();
	
	const enemiesText = new PixiElement({
		type: elementType.TEXT,
		text: 'Enemies'.toUpperCase(),
		style: {
			fontSize: 70,
			fontStyle: 'bold',
			fontWeight: 'normal',
			fill: 0xc81f12,
			stroke: 0x000000,
			strokeThickness: 6
		},
		anchor: [0.5]
	});
	const enemiesTextElement = enemiesText.getElement();
	
	enemiesTextElement.rotation = - Math.PI / 2;
	
	titleEnemiesElement.addChild(enemiesLogoElement, enemiesTextElement);
	
	setElementsPosition();
	function setElementsPosition() {
		enemiesLogoElement.position.set(titleEnemiesElement.width / 10 - 10, titleEnemiesElement.height / 2 + enemiesLogoElement.height / 2);
	}
	
	function onResizeHandler() {
		// setElementsPosition();
	}
	
	return titleEnemiesElement;
}
