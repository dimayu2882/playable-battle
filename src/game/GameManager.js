import { gsap } from 'gsap';

import { labels } from '../common/enums.js';
import { getUIElement, getUIElements } from '../helpers/index.js';
import { createScene } from '../ui/index.js';
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
		this.finishSceneLost = getUIElement(this.finishScene, labels.finishLost);
		this.scene = getUIElement(this.gameContainer, labels.scene);
		this.heros = getUIElements(this.scene, labels.heroContainer);
		this.enemies = getUIElements(this.scene, labels.enemyContainer);
		this.buttonPlay = getUIElement(this.gameContainer, labels.battleButton);
		this.buttonRestart = getUIElement(this.finishSceneLost, labels.buttonRetry);
		
		// Подписка на события EventBus
		eventBus.on('toggleSound', this.toggleSound);
		eventBus.on('showShadow', this.showShadow);
		eventBus.on('battleStart', () => {
			this.heros.forEach(hero => this.battleStart(hero, true));
			this.enemies.forEach(enemy => this.battleStart(enemy, false));
		});
		eventBus.on('characterDied', (character) => {
			character.isHero
				? this.heros = this.heros.filter(h => h.owner !== character)
				: this.enemies = this.enemies.filter(e => e.owner !== character);
			
			if (this.checkGameOver()) {
				this.finishScene.visible = true;
				console.log('game over');
			}
		});
		eventBus.on('restartGame', this.restartGame);
		
		// Добавление обработчиков
		this.soundButton.on('pointerdown', () => eventBus.emit('toggleSound'));
		this.buttonPlay.on('pointerdown', () => eventBus.emit('battleStart'));
		this.buttonRestart.on('pointerdown', () => eventBus.emit('restartGame'));
		
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
		
		this.heros.forEach(h => h.owner.highlightInvalid(false));
		
		this.heros.forEach(hero => {
			if (hero === target || !hero.visible) return;
			
			const sameType = hero.owner.heroType === target.owner.heroType;
			const sameHp = hero.owner.hp === target.owner.hp;
			
			if (!(sameType && sameHp)) {
				hero.owner.highlightInvalid(true);
			}
		});
	};
	
	onDragEnd = (event) => {
		const target = event.currentTarget;
		target.dragging = false;
		target.data = null;
		target.alpha = 1;
		target.zIndex -= 10;
		
		this.heros.forEach(h => h.owner.highlightInvalid(false));
		
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
			
			return distance > 0 && distance < 50;
		});
	}
	
	mergeHeroes(draggedHero, collidedHero) {
		const heroIndex = this.heros.indexOf(draggedHero);
		if (heroIndex > -1) this.heros.splice(heroIndex, 1);
		draggedHero.owner.getElement().destroy();
		this.showShadow(collidedHero.owner);
		this.buttonPlay.visible = true;
		
		console.log(this.heros);
	}
	
	animateReturn(target) {
		gsap.to(target, { x: target.startX, y: target.startY, duration: 0.3, ease: 'power2.out' });
	}
	
	showShadow(hero) {
		hero.showShadow();
		hero.increaseLevel();
	}
	
	battleStart = (character, hero) => {
		if (character) {
			const closestCharacter = this.findClosestCharacter(character, hero);
			if (closestCharacter) character.owner.moveCharacter(closestCharacter);
			return;
		}
		
		// Иначе запускаем для всех
		this.heros.forEach(hero => {
			const target = this.findClosestCharacter(hero, true);
			if (target) hero.owner.moveCharacter(target);
		});
		
		this.enemies.forEach(enemy => {
			const target = this.findClosestCharacter(enemy, false);
			if (target) enemy.owner.moveCharacter(target);
		});
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
	
	restartGame = () => {
		this.finishScene.visible = false;
		
		gsap.killTweensOf([...this.heros, ...this.enemies]);
		
		this.scene.destroy({ children: true });
		
		const newScene = createScene(this.app);
		
		// 6. Добавляем сцену в правильное место (после фона, но перед UI элементами)
		const backgroundIndex = this.gameContainer.children.findIndex(child => child.label === labels.background);
		if (backgroundIndex !== -1) {
			this.gameContainer.addChildAt(newScene, backgroundIndex + 1);
		} else {
			this.gameContainer.addChildAt(newScene, 1);
		}
		
		this.scene = getUIElement(this.gameContainer, labels.scene);
		this.heros = getUIElements(this.scene, labels.heroContainer);
		this.enemies = getUIElements(this.scene, labels.enemyContainer);
		
		// 9. Добавляем обработчики событий для новых героев
		this.heros.forEach(hero => {
			hero
				.on('pointerdown', this.onDragStart)
				.on('pointerup', this.onDragEnd)
				.on('pointerupoutside', this.onDragEnd)
				.on('pointermove', this.onDragMove);
		});
	};
	
	checkGameOver = () => this.heros.length === 0 || this.enemies.length === 0;
	
	toggleSound = () => {
		const isMuted = soundManager.toggleMute();
		
		gsap.to(this.slash, {
			visible: isMuted,
			duration: 0.25,
			ease: 'power2.out'
		});
	};
}
