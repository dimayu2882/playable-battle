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
		
		// основные свойства
		this.app = app;
		this.texture = texture;
		this.isHero = isHero;
		this.isEnemyKing = isEnemyKing;
		this.heroType = heroType;
		this.hp = hp;
		
		// внутренние элементы
		this.charterElement = null;
		this.characterLevelTwoElement = null;
		this.characterLevelTreeElement = null;
		this.characterHpBarElement = null;
		this.characterHpEmptyElement = null;
		this.characterHpFullElement = null;
		this.characterHpElement = null;
		this.characterHpTextElement = null;
		this.shadowMerge = null;
		this.spriteLevel = null;
		
		this.initCharacter();
	}
	
	/** Создание базового персонажа */
	initCharacter() {
		this.createBaseCharacter();
		this.createUpgradedCharacters();
		this.createHpBar();
		if (this.isHero) this.createShadowMerge();
		
		this.addChildren([this.charterElement, this.characterHpBarElement]);
		this.setElementsPosition();
	}
	
	/** Базовый спрайт */
	createBaseCharacter() {
		const character = new PixiElement({
			type: elementType.ANIMATED_SPRITE,
			texture: this.texture,
			animationSpeed: 0.6,
			loop: true,
			anchor: [0.5]
		});
		this.charterElement = character.getElement();
		this.charterElement.play();
		
		if (this.texture === allTextureKeys.gunslinger1Idle) {
			this.charterElement.scale.set(0.7);
		}
	}
	
	/** Анимации для апгрейдов героя */
	createUpgradedCharacters() {
		if (!this.isHero) return;
		
		if (this.texture === allTextureKeys.gunslinger1Idle) {
			this.characterLevelTwoElement = this.createAnimatedLevel(allTextureKeys.gunslinger2Idle, 0.7);
			this.characterLevelTreeElement = this.createAnimatedLevel(allTextureKeys.gunslinger3Idle, 0.7);
		}
		
		if (this.texture === allTextureKeys.minotaur1Idle) {
			this.characterLevelTwoElement = this.createAnimatedLevel(allTextureKeys.minotaur2Idle);
			this.characterLevelTwoElement.position.set(-24, -12);
			this.characterLevelTreeElement = this.createAnimatedLevel(allTextureKeys.minotaur3Idle);
		}
		
		if (this.characterLevelTwoElement && this.characterLevelTreeElement) {
			this.addChildren([this.characterLevelTwoElement, this.characterLevelTreeElement]);
		}
	}
	
	/** Утилита для создания скрытых анимаций апгрейдов */
	createAnimatedLevel(texture, scale = 1) {
		const el = new PixiElement({
			type: elementType.ANIMATED_SPRITE,
			texture,
			animationSpeed: 0.6,
			loop: true,
			anchor: [0.5],
			visible: false,
			scale: [scale, scale]
		}).getElement();
		el.play();
		return el;
	}
	
	/** Панель HP */
	createHpBar() {
		this.characterHpBarElement = new PixiElement({
			type: elementType.CONTAINER,
			label: labels.hpBar
		}).getElement();
		
		// пустая полоса
		this.characterHpEmptyElement = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys.hpBarEmpty
		}).getElement();
		
		// полная полоса
		const hpFullTexture = this.isHero ? allTextureKeys.hpBarHero : allTextureKeys.hpBarEnemy;
		this.characterHpFullElement = new PixiElement({
			type: elementType.SPRITE,
			texture: hpFullTexture
		}).getElement();
		
		// иконка уровня
		this.spriteLevel = this.getInitialLevelSprite();
		this.characterHpElement = new PixiElement({
			type: elementType.SPRITE,
			texture: this.spriteLevel
		}).getElement();
		
		// текст HP
		this.characterHpTextElement = new PixiElement({
			type: elementType.TEXT,
			text: this.hp,
			style: {
				fontSize: 30,
				fontStyle: 'bold',
				fill: 0xffffff,
				stroke: 0x000000,
				strokeThickness: 6
			},
			anchor: [0.5]
		}).getElement();
		
		this.characterHpBarElement.addChild(
			this.characterHpEmptyElement,
			this.characterHpFullElement,
			this.characterHpElement,
			this.characterHpTextElement
		);
	}
	
	/** Иконка уровня по умолчанию */
	getInitialLevelSprite() {
		if (this.isEnemyKing) return allTextureKeys.levelThreeEnemy;
		if (this.isHero) return allTextureKeys.levelOneHero;
		return allTextureKeys.levelOneEnemy;
	}
	
	/** Эффект слияния (для героев) */
	createShadowMerge() {
		this.shadowMerge = new PixiElement({
			type: elementType.ANIMATED_SPRITE,
			texture: allTextureKeys.mergeExplosionJSON,
			label: labels.shadowMerge,
			animationSpeed: 0.6,
			anchor: [0.5],
			visible: false
		}).getElement();
		
		this.addChildren([this.shadowMerge]);
	}
	
	/** Запуск анимации слияния */
	showShadow = () => {
		if (!this.shadowMerge) return;
		this.shadowMerge.visible = true;
		this.shadowMerge.loop = false;
		this.shadowMerge.animationSpeed = 1;
		this.shadowMerge.gotoAndStop(0);
		this.shadowMerge.play();
		this.shadowMerge.onComplete = () => (this.shadowMerge.visible = false);
	};
	
	/** Повышение уровня героя */
	increaseLevel = () => {
		this.hp++;
		this.characterHpTextElement.text = this.hp;
		
		if (this.hp === 2) {
			this.characterHpBarElement.scale.set(0.45);
			this.spriteLevel = allTextureKeys.levelTwoHero;
			this.switchCharacterLevel(this.charterElement, this.characterLevelTwoElement);
		}
		
		if (this.hp === 3) {
			this.characterHpBarElement.scale.set(0.5);
			this.spriteLevel = allTextureKeys.levelThreeHero;
			this.switchCharacterLevel(this.characterLevelTwoElement, this.characterLevelTreeElement);
		}
		
		this.characterHpElement.texture = Assets.cache.get(this.spriteLevel);
	};
	
	/** Переключение спрайтов уровня */
	switchCharacterLevel(hideElement, showElement) {
		if (hideElement) hideElement.visible = false;
		if (showElement) {
			showElement.visible = true;
			showElement.play();
		}
	}
	
	/** Позиции элементов */
	setElementsPosition = () => {
		const barScale = { 1: 0.35, 2: 0.4, 3: 0.5 }[this.hp] || 0.35;
		this.characterHpBarElement.scale.set(barScale);
		
		this.characterHpBarElement.pivot.set(
			this.characterHpBarElement.width / 2 + 20,
			this.characterHpBarElement.height / 2
		);
		this.characterHpBarElement.position.set(
			this.charterElement.x,
			this.charterElement.y - this.charterElement.height / 2.5
		);
		
		this.characterHpElement.anchor.set(0.5);
		this.characterHpElement.position.set(
			this.characterHpElement.x / 2 - this.characterHpElement.width / 4,
			8
		);
		
		this.characterHpTextElement.anchor.set(0.5);
		this.characterHpTextElement.position.set(
			this.characterHpElement.x,
			this.characterHpElement.y
		);
	};
	
	onResizeHandler() {
		this.setElementsPosition();
	}
}
