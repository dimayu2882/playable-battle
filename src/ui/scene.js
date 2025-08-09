import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import { createTitleEnemies, createTitleUser, createCharacter } from './index.js';

export default function createScene(app) {
	const scene = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.scene,
	}, onResizeHandler, true);
	const sceneElement = scene.getElement();
	
	const sceneBackground = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.field,
		label: labels.sceneBg,
		anchor: [0.5]
	});
	const sceneBackgroundElement = sceneBackground.getElement();
	
	const titleEnemies = createTitleEnemies(app);
	const titleUser = createTitleUser(app);
	
	const enemyOne = createCharacter(app, false);
	
	sceneElement.addChild(sceneBackgroundElement, titleEnemies, titleUser, enemyOne);
	
	setPosition();
	
	function setPosition() {
		sceneBackgroundElement.position.set(app.renderer.width / 2, app.renderer.height / 2);
		titleEnemies.position.set(
			app.renderer.width / 2 - sceneBackgroundElement.width / 2 + titleEnemies.width / 1.6,
			sceneBackgroundElement.height / 2.8
		);
		titleUser.position.set(
			app.renderer.width / 2 - sceneBackgroundElement.width / 2 + titleUser.width / 2.8,
			sceneBackgroundElement.height / 1.3
		);
		enemyOne.position.set(
			app.renderer.width / 2 - sceneBackgroundElement.width / 2 + enemyOne.width / 2.8,
			sceneBackgroundElement.height / 1.3
		);
	}
	
	function onResizeHandler() {
		setPosition();
	}
	
	return sceneElement;
}
