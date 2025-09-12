import { Assets } from 'pixi.js';

import { eventBus } from '../utils/EventBus.js';
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
		this.level = hp;
		
		// внутренние элементы
		this.charterElement = null;
		this.characterAttackElement = null;
		this.characterMoveElement = null;
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
		if (this.isHero) {
			// герой: создаём idle по уровню
			this.charterElement = this.createIdleByLevel(this.level);
			this.createHeroStates();
			this.createHpBar();
			this.createShadowMerge();
			this.addChildren([this.charterElement, this.characterAttackElement, this.characterMoveElement, this.characterHpBarElement]);
		} else {
			this.charterElement = this.createAnimatedSprite({ texture: this.texture });
			this.createEnemyStates();
			this.createHpBar();
			this.addChildren([this.charterElement, this.characterAttackElement, this.characterMoveElement, this.characterHpBarElement]);
		}
		
		this.setElementsPosition();
	}
	
	/** Универсальный метод для AnimatedSprite */
	createAnimatedSprite({ texture, speed = 0.6, loop = true, anchor = [0.5], visible = true, scale }) {
		const el = new PixiElement({
			type: elementType.ANIMATED_SPRITE,
			texture,
			animationSpeed: speed,
			loop,
			anchor,
			visible,
			scale: scale ? [scale, scale] : undefined
		}).getElement();
		el.play();
		return el;
	}
	
	/** Создание idle в зависимости от уровня */
	createIdleByLevel(level) {
		const isGunslinger = this.texture === allTextureKeys.gunslinger1Idle;
		
		const textures = {
			1: isGunslinger ? allTextureKeys.gunslinger1Idle : allTextureKeys.minotaur1Idle,
			3: isGunslinger ? allTextureKeys.gunslinger2Idle : allTextureKeys.minotaur2Idle,
			5: isGunslinger ? allTextureKeys.gunslinger3Idle : allTextureKeys.minotaur3Idle
		};
		
		const scale = isGunslinger ? 0.7 : 1;
		const el = this.createAnimatedSprite({
			texture: textures[level],
			scale
		});
		
		// особый сдвиг для минотавра lvl2
		if (!isGunslinger && level === 2) el.position.set(-24, -12);
		
		return el;
	}
	
	/** Состояния героя (idle/attack/move) */
	createHeroStates() {
		const isGunslinger = this.texture === allTextureKeys.gunslinger1Idle;
		
		this.characterAttackElement = this.createCharacterState(
			isGunslinger ? allTextureKeys.gunslinger1Attack : allTextureKeys.minotaur1Attack,
			0.5,
			labels.heroAttack,
			isGunslinger ? 0.7 : 1
		);
		
		this.characterMoveElement = this.createCharacterState(
			isGunslinger ? allTextureKeys.gunslinger1Move : allTextureKeys.minotaur1Move,
			0.2,
			labels.heroMove,
			isGunslinger ? 0.7 : 1
		);
		
		if (isGunslinger) this.charterElement.scale.set(0.7);
	}
	
	/** Состояния врагов */
	createEnemyStates() {
		if (this.isEnemyKing) {
			this.characterAttackElement = this.createCharacterState(allTextureKeys.skeletonKingAttack, 0.2, labels.skeletonKing, 1.3);
			this.characterMoveElement = this.createCharacterState(allTextureKeys.skeletonKingIdle, 0.2, labels.skeletonKing);
		} else {
			this.characterAttackElement = this.createCharacterState(allTextureKeys.skeletonAttack, 0.5, labels.skeleton);
			this.characterMoveElement = this.createCharacterState(allTextureKeys.skeletonMove, 0.2, labels.skeleton);
		}
	}
	
	/** Универсальное создание атаки/движения */
	createCharacterState(texture, speed, label, scale = 1) {
		return this.createAnimatedSprite({
			texture,
			speed,
			loop: true,
			anchor: [0.5],
			visible: false,
			scale
		});
	}
	
	/** Панель HP */
	createHpBar() {
		this.characterHpBarElement = new PixiElement({
			type: elementType.CONTAINER,
			label: labels.hpBar,
			zIndex: 9
		}).getElement();
		
		this.characterHpEmptyElement = new PixiElement({
			type: elementType.SPRITE,
			texture: allTextureKeys.hpBarEmpty
		}).getElement();
		
		const hpFullTexture = this.isHero ? allTextureKeys.hpBarHero : allTextureKeys.hpBarEnemy;
		this.characterHpFullElement = new PixiElement({
			type: elementType.SPRITE,
			texture: hpFullTexture
		}).getElement();
		
		this.spriteLevel = this.getInitialLevelSprite();
		this.characterHpElement = new PixiElement({
			type: elementType.SPRITE,
			texture: this.spriteLevel
		}).getElement();
		
		this.characterHpTextElement = new PixiElement({
			type: elementType.TEXT,
			text: this.level,
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
	
	getInitialLevelSprite() {
		if (this.isEnemyKing) return allTextureKeys.levelThreeEnemy;
		if (this.isHero) return allTextureKeys.levelOneHero;
		return allTextureKeys.levelOneEnemy;
	}
	
	createShadowMerge() {
		this.shadowMerge = this.createAnimatedSprite({
			texture: allTextureKeys.mergeExplosionJSON,
			speed: 0.6,
			visible: false,
			anchor: [0.5]
		});
		this.shadowMerge.label = labels.shadowMerge;
		
		this.addChildren([this.shadowMerge]);
	}
	
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
		this.hp += 2;
		this.level += 2;
		this.characterHpTextElement.text = this.level;
		
		// Удаляем старые idle/attack/move
		if (this.charterElement) this.charterElement.destroy();
		if (this.characterAttackElement) this.characterAttackElement.destroy();
		if (this.characterMoveElement) this.characterMoveElement.destroy();
		
		// Создаём новые idle/attack/move для уровня hp
		this.charterElement = this.createIdleByLevel(this.level);
		
		const isGunslinger = this.texture === allTextureKeys.gunslinger1Idle;
		if (this.level === 3) {
			this.characterHpBarElement.scale.set(0.45);
			this.spriteLevel = allTextureKeys.levelTwoHero;
		} else if (this.level === 5) {
			this.characterHpBarElement.scale.set(0.5);
			this.spriteLevel = allTextureKeys.levelThreeHero;
		}
		
		this.characterAttackElement = this.createCharacterState(
			isGunslinger
				? (this.level === 3 ? allTextureKeys.gunslinger2Attack : allTextureKeys.gunslinger3Attack)
				: (this.level === 3 ? allTextureKeys.minotaur2Attack : allTextureKeys.minotaur3Attack),
			0.5,
			labels.heroAttack,
			isGunslinger ? 0.85 : 1
		);
		
		this.characterMoveElement = this.createCharacterState(
			isGunslinger
				? (this.level === 3 ? allTextureKeys.gunslinger2Move : allTextureKeys.gunslinger3Move)
				: (this.level === 3 ? allTextureKeys.minotaur2Move : allTextureKeys.minotaur3Move),
			0.2,
			labels.heroMove,
			isGunslinger ? 0.85 : 1
		);
		
		this.addChildren([this.charterElement, this.characterAttackElement, this.characterMoveElement]);
		this.characterHpElement.texture = Assets.cache.get(this.spriteLevel);
	};
	
	moveCharacter(target, speed = 2) {
		this.charterElement.visible = false;
		this.characterMoveElement.visible = true;
		
		const ticker = this.app.ticker;
		
		const update = () => {
			if (!target.visible) {
				ticker.remove(update);
				return;
			}
			
			const dx = target.x - this.getElement().x;
			const dy = target.y - this.getElement().y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			
			if (dist < 80) {
				// дошёл до врага
				this.characterMoveElement.visible = false;
				this.characterAttackElement.visible = true;
				
				this.startAttack(target.owner);
				
				ticker.remove(update);
				return;
			}
			
			const vx = (dx / dist) * speed;
			const vy = (dy / dist) * speed;
			
			this.getElement().x += vx;
			this.getElement().y += vy;
		};
		
		ticker.add(update);
	}
	
	startAttack(targetOwner) {
		if (!targetOwner || !targetOwner.takeDamage) return;
		
		// если у атакующего уже есть активный цикл — не запускать второй
		if (this.attackInterval) return;
		
		this.attackInterval = setInterval(() => {
			// урон равен hp атакующего
			targetOwner.takeDamage(this.hp);
			
			// если цель умерла — прекратить атаку
			if (targetOwner.level <= 0) {
				clearInterval(this.attackInterval);
				this.attackInterval = null;
				this.characterAttackElement.visible = false;
				this.charterElement.visible = true;
				eventBus.emit('battleStart');
			}
		}, 2000);
	}
	
	takeDamage(amount) {
		if (this.isHero) {
			console.log(this.level, this.heroType);
		}
		this.level -= amount;
		if (this.level < 0) this.level = 0;
		
		// визуально обновить HP bar
		const maxHpWidth = this.characterHpEmptyElement.width;
		this.characterHpFullElement.width = (this.level / 3) * maxHpWidth;
		
		if (this.level <= 0) {
			this.die();
		}
	}
	
	die() {
		this.getElement().visible = false;
		if (this.attackInterval) clearInterval(this.attackInterval);
		
		// убрать из массива героев/врагов (лучше через GameManager)
		eventBus.emit('characterDied', this);
	}
	
	setElementsPosition = () => {
		const barScale = { 1: 0.35, 2: 0.4, 3: 0.5 }[this.level] || 0.35;
		this.characterHpBarElement.scale.set(barScale);
		
		this.characterHpBarElement.pivot.set(
			this.characterHpBarElement.width / 2 + 20,
			this.characterHpBarElement.height / 2
		);
		this.characterHpBarElement.position.set(
			this.charterElement.x,
			this.charterElement.y - this.charterElement.height / 2
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
