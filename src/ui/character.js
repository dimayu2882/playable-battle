import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export class CharacterElement extends PixiElement {
	constructor(app, texture, isHero, isEnemyKing, hp = 1) {
		super({
			type: elementType.CONTAINER,
			label: isHero ? labels.heroContainer : labels.enemyContainer,
			interactive: isHero,
			buttonMode: isHero,
			cursor: isHero ? 'pointer' : 'default',
		}, () => this.onResizeHandler(), true);
		
		this.getElement().owner = this;
		this.app = app;
		this.texture = texture;
		this.isHero = isHero;
		this.isEnemyKing = isEnemyKing;
		this.hp = hp;
		
		this.initCharacter();
	}
	
	initCharacter() {
		const character = new PixiElement({
			type: elementType.ANIMATED_SPRITE,
			texture: this.texture,
			animationSpeed: 0.6,
			loop: true,
			anchor: [0.5],
		});
		this.charterElement = character.getElement();
		this.charterElement.play();
		
		if (this.texture === allTextureKeys.gunslinger1Idle) this.charterElement.scale.set(0.7);
		
		const characterHpBar = new PixiElement({
			type: elementType.CONTAINER,
			label: labels.hpBar,
		});
		this.characterHpBarElement = characterHpBar.getElement();
		
		const characterHpEmpty = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys.hpBarEmpty,
		});
		this.characterHpEmptyElement = characterHpEmpty.getElement();
		
		const characterHpFull = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys.hpBarEnemy,
		});
		this.characterHpFullElement = characterHpFull.getElement();
		
		let spriteLevel = allTextureKeys.levelOneEnemy;
		if (this.hp === 2) spriteLevel = allTextureKeys.levelTwoHero;
		if (this.hp === 3) spriteLevel = allTextureKeys.levelThreeEnemy;
		
		const characterHp = new PixiElement({
			type: elementType.SPRITE,
			texture: spriteLevel,
		});
		this.characterHpElement = characterHp.getElement();
		
		const characterHpText = new PixiElement({
			type: elementType.TEXT,
			text: this.hp,
			style: {
				fontSize: 30,
				fontStyle: 'bold',
				fontWeight: 'normal',
				fill: 0xffffff,
				stroke: 0x000000,
				strokeThickness: 6
			},
			anchor: [0.5]
		});
		this.characterHpTextElement = characterHpText.getElement();
		
		this.characterHpBarElement.addChild(
			this.characterHpEmptyElement,
			this.characterHpFullElement,
			this.characterHpElement,
			this.characterHpTextElement
		);
		
		this.addChildren([this.charterElement, this.characterHpBarElement]);
		this.setElementsPosition();
	}
	
	moveCharacter() {
		console.log('👊');
	}
	
	setElementsPosition = () => {
		if (this.hp === 1) this.characterHpBarElement.scale.set(0.35);
		
		if (this.hp === 3) this.characterHpBarElement.scale.set(0.5);
		
		this.characterHpBarElement.pivot.set(
			this.characterHpBarElement.width / 2 + 20,
			this.characterHpBarElement.height / 2
		);
		this.characterHpBarElement.position.set(this.charterElement.x, this.charterElement.y - this.charterElement.height / 2.5);
		
		
		this.characterHpElement.anchor.set(0.5);
		this.characterHpElement.position.set(this.characterHpElement.x / 2 - this.characterHpElement.width / 4, 8);
		
		this.characterHpTextElement.anchor.set(0.5);
		this.characterHpTextElement.position.set(this.characterHpElement.x, this.characterHpElement.y);
	}
	
	onResizeHandler() {
		this.setElementsPosition();
	}
}
