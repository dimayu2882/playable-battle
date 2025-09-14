import gsap from 'gsap';
import { Graphics } from 'pixi.js';

import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export default function createSceneFinish(app) {
	const sceneFinish = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.sceneFinish,
		visible: false,
	}, onResizeHandler, true);
	const elementSceneFinish = sceneFinish.getElement();
	
	const finishLost = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.finishLost,
		pivot: [0.5]
	});
	const elementFinishLost = finishLost.getElement();
	
	const bg = new Graphics()
		.rect(0, 0, app.screen.width, app.screen.height)
		.fill({ color: 0x333333, alpha: 0.7 });
	
	const finishLostText = new PixiElement({
		type: elementType.TEXT,
		text: 'you Lose'.toUpperCase(),
		style: {
			fontSize: 80,
			fontStyle: 'bold',
			fontWeight: 'normal',
			fill: 0xc81f12,
			stroke: 0x000000,
			strokeThickness: 6
		},
		anchor: [0.5]
	});
	const elementFinishLostText = finishLostText.getElement();
	
	const finishLostButton = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.buttonYellow,
		label: labels.buttonRetry,
		anchor: [0.5],
		interactive: true,
		buttonMode: true,
		cursor: 'pointer',
	});
	const elementFinishLostButton = finishLostButton.getElement();
	
	const finishLostButtonLabel = new PixiElement({
		type: elementType.TEXT,
		text: 'try again'.toUpperCase(),
		style: {
			fontSize: 70,
			fontStyle: 'bold',
			fontWeight: 'normal',
			fill: 0xffffff,
			stroke: 0x000000,
			strokeThickness: 6
		},
		anchor: [0.5]
	});
	const elementFinishLostButtonLabel = finishLostButtonLabel.getElement();
	
	elementFinishLostButton.addChild(elementFinishLostButtonLabel);
	
	elementFinishLost.addChild(elementFinishLostText, elementFinishLostButton);
	
	elementSceneFinish.addChild(bg, elementFinishLost);
	
	gsap.to(elementFinishLostButton.scale, {
		x: 0.9,
		y: 0.9,
		duration: 1,
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut',
	});
	
	function setElementsPosition() {
		bg.clear()
			.rect(0, 0, app.screen.width, app.screen.height)
			.fill({ color: 0x333333, alpha: 0.7 });
		
		elementFinishLostText.position.set(app.renderer.width / 2, app.renderer.height / 4);
		elementFinishLostButton.position.set(app.renderer.width / 2, app.renderer.height / 2);
	}
	
	setElementsPosition();
	
	function onResizeHandler() {
		setElementsPosition();
	}

	return elementSceneFinish;
}
