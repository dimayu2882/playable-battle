import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export default function createCharacter(app, isHero) {
	const characterContainer = new PixiElement({
		type: elementType.CONTAINER,
		label: isHero ? labels.heroContainer : labels.enemyContainer,
	}, onResizeHandler, true);
	const characterContainerElement = characterContainer.getElement();
	
	const character = new PixiElement({
		type: elementType.ANIMATED_SPRITE,
		texture: allTextureKeys.skeletonIdle,
		animationSpeed: 0.6,
		loop: true,
		label: isHero ? labels.hero : labels.enemy,
		anchor: [0.5],
	});
	const charterElement = character.getElement();
	charterElement.play();
	
	characterContainerElement.addChild(charterElement);
	
	setElementsPosition();
	function setElementsPosition() {
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return characterContainerElement;
}
