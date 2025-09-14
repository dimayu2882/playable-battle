import gsap from 'gsap';

import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';

export default function createButtonBattle(app) {
	const buttonBattle = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.battleButton,
		label: labels.battleButton,
		interactive: true,
		buttonMode: true,
		cursor: 'pointer',
		anchor: [0.5],
		scale: [0.5],
		visible: false
	}, onResizeHandler, true);
	const buttonBattleElement = buttonBattle.getElement();
	
	gsap.to(buttonBattleElement.scale, {
		x: 0.6,
		y: 0.6,
		duration: 1,
		repeat: -1,
		yoyo: true,
		ease: 'power1.inOut',
	});
	
	setElementsPosition();
	function setElementsPosition() {
		buttonBattleElement.position.set(app.renderer.width / 1.1, app.renderer.height / 2 + 20);
	}
	
	function onResizeHandler() {
		setElementsPosition();
	}
	
	return buttonBattleElement;
}
