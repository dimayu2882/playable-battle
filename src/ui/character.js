import { Assets } from 'pixi.js';

import { allTextureKeys } from '../common/assets.js';
import { PixiElement } from '../utils/PixiElement.js';
import { elementType, labels } from '../common/enums.js';

export class CharacterElement extends PixiElement {
	constructor(app, texture, isHero, isEnemyKing, hp = 1, heroType, zIndex) {
		super({
			type: elementType.CONTAINER,
			label: isHero ? labels.heroContainer : labels.enemyContainer,
			interactive: isHero,
			buttonMode: isHero,
			cursor: isHero ? 'pointer' : 'default',
			zIndex
		}, () => this.onResizeHandler, true);
		
		this.getElement().owner = this;
		this.app = app;
		this.texture = texture;
		this.isHero = isHero;
		this.isEnemyKing = isEnemyKing;
		this.heroType = heroType;
		this.hp = hp;
		this.characterHp = null;
		this.spriteLevel = null;
		this.characterHpFull = null;
		this.shadowMerge = null;
		
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
		
		if (this.isHero && this.texture === allTextureKeys.gunslinger1Idle) {
			const characterLevelTwo = new PixiElement({
				type: elementType.ANIMATED_SPRITE,
				texture: allTextureKeys.gunslinger2Idle,
				animationSpeed: 0.6,
				loop: true,
				anchor: [0.5],
				visible: false,
				scale: [0.7]
			});
			this.characterLevelTwoElement = characterLevelTwo.getElement();
			this.characterLevelTwoElement.play();
			
			const characterLevelTree = new PixiElement({
				type: elementType.ANIMATED_SPRITE,
				texture: allTextureKeys.gunslinger3Idle,
				animationSpeed: 0.6,
				loop: true,
				anchor: [0.5],
				visible: false,
				scale: [0.7]
			});
			this.characterLevelTreeElement = characterLevelTree.getElement();
			this.characterLevelTreeElement.play();
			
			this.addChildren([this.characterLevelTwoElement, this.characterLevelTreeElement]);
		}
		
		if (this.texture === allTextureKeys.gunslinger1Idle) this.charterElement.scale.set(0.7);
		
		const characterHpBar = new PixiElement({
			type: elementType.CONTAINER,
			label: labels.hpBar,
		});
		this.characterHpBarElement = characterHpBar.getElement();
		
		this.characterHpEmpty = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys.hpBarEmpty,
		});
		this.characterHpEmptyElement = this.characterHpEmpty.getElement();
		
		if (this.isHero) {
			this.characterHpFull = new PixiElement({
				type: elementType.SPRITE,
				texture: allTextureKeys.hpBarHero,
			});
		} else {
			this.characterHpFull = new PixiElement({
				type: elementType.SPRITE,
				texture: allTextureKeys.hpBarEnemy,
			});
		}
		this.characterHpFullElement = this.characterHpFull.getElement();
		
		this.spriteLevel = allTextureKeys.levelOneEnemy;
		if (this.isEnemyKing) this.spriteLevel = allTextureKeys.levelThreeEnemy;
		if (this.isHero) this.spriteLevel = allTextureKeys.levelOneHero;
		
		this.characterHp = new PixiElement({
			type: elementType.SPRITE,
			texture: this.spriteLevel,
		});
		this.characterHpElement = this.characterHp.getElement();
		
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
		
		if (this.isHero) {
			this.shadowMerge = new PixiElement({
				type: elementType.ANIMATED_SPRITE,
				texture: allTextureKeys.mergeExplosionJSON,
				label: labels.shadowMerge,
				animationSpeed: 0.6,
				anchor: [0.5],
				visible: false,
			}).getElement();
			
			this.addChildren([this.shadowMerge]);
		}
		
		this.addChildren([this.charterElement, this.characterHpBarElement]);
		this.setElementsPosition();
	}
	
	showShadow = () => {
		this.shadowMerge.visible = true;
		this.shadowMerge.loop = false;
		this.shadowMerge.animationSpeed = 1;
		this.shadowMerge.gotoAndStop(0);
		this.shadowMerge.play();
	};
	
	increaseLevel = () => {
		this.hp++;
		this.characterHpTextElement.text = this.hp;
		if (this.hp === 2) {
			this.characterHpBarElement.scale.set(0.45);
			this.spriteLevel = allTextureKeys.levelTwoHero;
			
			this.charterElement.visible = false;
			this.characterLevelTwoElement.visible = true;
			this.characterLevelTwoElement.play();
		}
		if (this.hp === 3) {
			this.characterHpBarElement.scale.set(0.5);
			this.spriteLevel = allTextureKeys.levelThreeHero;
			
			this.characterLevelTwoElement.visible = false;
			this.characterLevelTreeElement.visible = true;
			this.characterLevelTreeElement.play();
		}
		
		this.characterHpElement.texture = Assets.cache.get(this.spriteLevel);
		
		console.log(this.hp, this.spriteLevel, this.characterHp);
	};
	
	setElementsPosition = () => {
		if (this.hp === 1) this.characterHpBarElement.scale.set(0.35);
		if (this.hp === 2) this.characterHpBarElement.scale.set(0.4);
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
