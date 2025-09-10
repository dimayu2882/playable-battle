import { Container, Graphics } from 'pixi.js';

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
	
	const sceneBgContainer = new Container();
	sceneElement.addChild(sceneBgContainer);
	
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
	
	sceneBgContainer.addChild(sceneBackgroundElement, titleEnemies, titleUser, ...enemies, ...heroes);
	
	setPosition();
	
	function setPosition() {
		sceneBgContainer.position.set(
			app.renderer.width / 2,
			app.renderer.height / 2
		);
		
		sceneBackgroundElement.position.set(0, 0);
		
		titleEnemies.position.set(
			-sceneBackgroundElement.width / 2 + titleEnemies.width / 1.6,
			-sceneBackgroundElement.height / 2 + titleEnemies.height / 1.2
		);
		
		titleUser.position.set(
			-sceneBackgroundElement.width / 2 + titleEnemies.width / 1.6,
			-sceneBackgroundElement.height / 6 + titleEnemies.height / 1.2
		);
		
		enemies[0].position.set(0, -enemies[0].height / 2);
		enemies[1].position.set(-enemies[1].width / 1.3, -enemies[1].height / 2);
		enemies[2].position.set(-enemies[2].width / 0.65, -enemies[2].height / 2);
		enemies[3].position.set(-enemies[3].width / 0.65, -enemies[3].height / 0.8);
		enemies[4].position.set(-enemies[4].width / 1.1, -enemies[4].height / 0.6);
		enemies[5].position.set(-enemies[5].width / 12, -enemies[5].height / 0.6);
		enemies[6].position.set(sceneBackgroundElement.width / 3.5, -enemies[6].height / 0.6);
		enemies[7].position.set(sceneBackgroundElement.width / 4,-sceneBackgroundElement.height / 13);
		
		heroes[0].position.set(heroes[0].width / 0.5, sceneBackgroundElement.height / 4);
		heroes[1].position.set(heroes[1].width / 1.1, sceneBackgroundElement.height / 4);
		heroes[2].position.set(-heroes[2].width / 0.5, sceneBackgroundElement.height / 4);
		heroes[3].position.set(-heroes[3].width / 0.9, sceneBackgroundElement.height / 8);
		heroes[4].position.set(-heroes[4].width / 1.4, sceneBackgroundElement.height / 4);
		heroes[5].position.set(0, sceneBackgroundElement.height / 15);
		heroes[6].position.set(sceneBackgroundElement.width / 4, sceneBackgroundElement.height / 7);
		heroes[7].position.set(-heroes[7].width / 0.7, sceneBackgroundElement.height / 15);
	}
	
	function onResizeHandler() {
		setPosition();
	}
	
	return sceneElement;
}
