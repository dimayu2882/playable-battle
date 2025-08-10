import { PixiElement } from '../utils/PixiElement.js';
import { allTextureKeys } from '../common/assets.js';
import { elementType, labels } from '../common/enums.js';
import { CharacterElement } from './character.js';
import { createTitleEnemies, createTitleUser } from './index.js';

export default function createScene(app) {
	const scene = new PixiElement({
		type: elementType.CONTAINER,
		label: labels.scene
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
	
	// Конфигурация врагов
	const enemiesConfig = [
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonIdle,
			isHero: false,
			isKing: false,
			hp: 1
		},
		{
			texture: allTextureKeys.skeletonKingIdle,
			isHero: false,
			isKing: true,
			hp: 3
		}
	];
	
	let enemies = [];
	
	// Создаем врагов
	enemies = enemiesConfig.map(config => {
		return new CharacterElement(
			app,
			config.texture,
			config.isHero,
			config.isKing,
			config.hp
		).getElement();
	});
	
	const heroesConfig = [
		{
			texture: allTextureKeys.minotaur1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroOne
		},
		{
			texture: allTextureKeys.minotaur1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroOne
		},
		{
			texture: allTextureKeys.minotaur1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroOne
		},
		{
			texture: allTextureKeys.minotaur1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroOne
		},
		{
			texture: allTextureKeys.gunslinger1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroTwo
		},
		{
			texture: allTextureKeys.gunslinger1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroTwo
		},
		{
			texture: allTextureKeys.gunslinger1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroTwo
		},
		{
			texture: allTextureKeys.gunslinger1Idle,
			isHero: true,
			isKing: false,
			hp: 1,
			heroType: labels.heroTwo
		},
	];
	
	let heroes = [];
	
	heroes = heroesConfig.map((config, index) => {
		return new CharacterElement(
			app,
			config.texture,
			config.isHero,
			config.isKing,
			config.hp,
			config.heroType,
			index
		).getElement();
	});

	sceneElement.addChild(sceneBackgroundElement, titleEnemies, titleUser, ...enemies, ...heroes);
	sceneElement.sortChildren();
	
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
		
		enemies[0].position.set(
			app.renderer.width / 2 + sceneBackgroundElement.width / 2.65 - enemies[0].width / 2,
			sceneBackgroundElement.height / 2.4
		);
		
		enemies[1].position.set(
			app.renderer.width / 2 + sceneBackgroundElement.width / 4.65 - enemies[1].width / 2,
			sceneBackgroundElement.height / 2.4
		);
		
		enemies[2].position.set(
			app.renderer.width / 2 - enemies[2].width / 10.65,
			sceneBackgroundElement.height / 2.4
		);
		
		enemies[3].position.set(
			app.renderer.width / 2 + sceneBackgroundElement.width / 2.65 - enemies[3].width / 2,
			sceneBackgroundElement.height / 3.4
		);
		
		enemies[4].position.set(
			app.renderer.width / 2 + sceneBackgroundElement.width / 10.65 - enemies[4].width / 2,
			sceneBackgroundElement.height / 3.4
		);
		
		enemies[5].position.set(
			app.renderer.width / 2.5 - enemies[5].width / 2,
			sceneBackgroundElement.height / 3.4
		);
		
		enemies[6].position.set(
			app.renderer.width / 2 + sceneBackgroundElement.width / 4.65 - enemies[6].width / 2,
			sceneBackgroundElement.height / 4.4
		);
		
		enemies[7].position.set(
			app.renderer.width / 2.2 - enemies[7].width / 2,
			sceneBackgroundElement.height / 2.4
		);
		
		heroes[0].position.set(
			app.renderer.width / 1.85 - heroes[0].width / 2,
			sceneBackgroundElement.height / 1.46
		);
		
		heroes[1].position.set(
			app.renderer.width / 1.5 - heroes[1].width / 2,
			sceneBackgroundElement.height / 1.46
		);
		
		heroes[2].position.set(
			app.renderer.width / 2.8 - heroes[2].width / 10.65,
			sceneBackgroundElement.height / 1.46
		);
		
		heroes[3].position.set(
			app.renderer.width / 2.2 - heroes[3].width / 2,
			sceneBackgroundElement.height / 1.8
		);
		
		heroes[4].position.set(
			app.renderer.width / 2.1 - heroes[4].width / 2,
			sceneBackgroundElement.height / 1.46
		);
		
		heroes[5].position.set(
			app.renderer.width / 1.45 - heroes[5].width / 2,
			sceneBackgroundElement.height / 1.8
		);
		
		heroes[6].position.set(
			app.renderer.width / 1.85 - heroes[6].width / 2,
			sceneBackgroundElement.height / 1.8
		);
		
		heroes[7].position.set(
			app.renderer.width / 2.45 - heroes[7].width / 2,
			sceneBackgroundElement.height / 1.8
		);
	}
	
	function onResizeHandler() {
		setPosition();
	}
	
	return sceneElement;
}
