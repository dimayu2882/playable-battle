import { gsap } from 'gsap';

import { labels } from '../common/enums.js';
import { getUIElement, getUIElements } from '../helpers/index.js';
import { eventBus } from '../utils/EventBus.js';
import { soundManager } from '../utils/SoundManager.js';

export class GameManager {
	constructor(app) {
		this.app = app;
		
		// Инициализация UI элементов
		this.gameContainer = getUIElement(this.app.stage, labels.game);
		this.soundButton = getUIElement(this.gameContainer, labels.sound);
		this.slash = getUIElement(this.soundButton, labels.muteSlash);
		this.finishScene = getUIElement(this.gameContainer, labels.sceneFinish);
		this.scene = getUIElement(this.gameContainer, labels.scene);
		this.heros = getUIElements(this.scene, labels.heroContainer);
		this.enemies = getUIElements(this.scene, labels.enemyContainer);
		this.buttonPlay = getUIElement(this.gameContainer, labels.battleButton);
		
		// Подписка на события EventBus
		eventBus.on('toggleSound', this.toggleSound);
		eventBus.on('showShadow', this.showShadow);
		eventBus.on('battleStart', () => {
			this.heros.forEach(hero => this.battleStart(hero, true));
			this.enemies.forEach(enemy => this.battleStart(enemy, false));
		});
		
		// Добавление обработчиков
		this.soundButton.on('pointerdown', () => eventBus.emit('toggleSound'));
		this.buttonPlay.on('pointerdown', () => eventBus.emit('battleStart'));
		
		this.heros.forEach(hero => {
			hero
				.on('pointerdown', this.onDragStart)
				.on('pointerup', this.onDragEnd)
				.on('pointerupoutside', this.onDragEnd)
				.on('pointermove', this.onDragMove);
		});
		
		console.log(this.heros);
		
		soundManager.play('bg');
	};
	
	onDragStart = (event) => {
		const target = event.currentTarget;
		
		target.dragging = true;
		target.data = event.data;
		
		target.startX = target.x;
		target.startY = target.y;
		
		const newPosition = target.data.getLocalPosition(target.parent);
		target.dragOffset = {
			x: newPosition.x - target.x,
			y: newPosition.y - target.y
		};
		
		target.alpha = 0.7;
		target.zIndex += 10;
	};
	
	onDragMove = (event) => {
		const target = event.currentTarget;
		if (!target.dragging) return;
		
		const newPosition = target.data.getLocalPosition(target.parent);
		target.x = newPosition.x - target.dragOffset.x;
		target.y = newPosition.y - target.dragOffset.y;
	};
	
	onDragEnd = (event) => {
		const target = event.currentTarget;
		target.dragging = false;
		target.data = null;
		target.alpha = 1;
		target.zIndex -= 10;
		
		const collidedHero = this.findCollidedHero(target);
		
		if (collidedHero) {
			const draggedHeroType = target.owner.heroType;
			const collidedHeroType = collidedHero.owner.heroType;
			
			if (draggedHeroType === collidedHeroType && target.owner.hp === collidedHero.owner.hp) {
				this.mergeHeroes(target, collidedHero);
			} else {
				this.animateReturn(target);
			}
		} else {
			this.animateReturn(target);
		}
	};
	
	findCollidedHero(target) {
		return this.heros.find(hero => {
			if (hero === target || !hero.visible) return false;
			
			const dx = hero.x - target.x;
			const dy = hero.y - target.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			return distance < 50;
		});
	}
	
	mergeHeroes(draggedHero, collidedHero) {
		const heroIndex = this.heros.indexOf(draggedHero);
		if (heroIndex > -1) {
			this.heros.splice(heroIndex, 1);
		}
		draggedHero.owner.getElement().visible = false;
		this.showShadow(collidedHero.owner);
	}
	
	animateReturn(target) {
		gsap.to(target, { x: target.startX, y: target.startY, duration: 0.3, ease: 'power2.out' });
	}
	
	showShadow(hero) {
		hero.showShadow();
		hero.increaseLevel();
	}
	
	battleStart = (character, hero) => {
		const closestCharacter = this.findClosestCharacter(character, hero);
		if (closestCharacter) character.owner.moveCharacter(closestCharacter);
	}
	
	findClosestCharacter(character, hero) {
		if (hero) {
			if (!this.enemies.length) return null;
		} else {
			if (!this.heros.length) return null;
		}
		
		let closest = null;
		let minDist = Infinity;
		
		if (hero) {
			this.enemies.forEach(enemy => {
				const dx = enemy.x - character.x;
				const dy = enemy.y - character.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				
				if (dist < minDist) {
					minDist = dist;
					closest = enemy;
				}
			});
		} else {
			this.heros.forEach(hero => {
				const dx = hero.x - character.x;
				const dy = hero.y - character.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				
				if (dist < minDist) {
					minDist = dist;
					closest = hero;
				}
			});
		}
		
		return closest;
	}
	
	toggleSound = () => {
		const isMuted = soundManager.toggleMute();
		
		gsap.to(this.slash, {
			visible: isMuted,
			duration: 0.25,
			ease: 'power2.out'
		});
	};
}
