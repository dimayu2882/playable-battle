import { Container } from 'pixi.js';

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
	
	// контейнер с фоном и юнитами
	const sceneBgContainer = new Container();
	sceneElement.addChild(sceneBgContainer);
	
	// фон
	const sceneBackground = new PixiElement({
		type: elementType.SPRITE,
		texture: allTextureKeys.field,
		label: labels.sceneBg,
		anchor: [0.5]
	});
	const sceneBackgroundElement = sceneBackground.getElement();
	
	// заголовки
	const titleEnemies = createTitleEnemies(app);
	const titleUser = createTitleUser(app);
	
	// конфиг врагов
	const enemiesConfig = [
		...Array(6).fill({ texture: allTextureKeys.skeletonIdle, isKing: false, hp: 1 }),
		{ texture: allTextureKeys.skeletonKingIdle, isKing: true, hp: 3 }
	];
	
	// создаём врагов
	const enemies = enemiesConfig.map(cfg =>
		new CharacterElement(app, cfg.texture, false, cfg.isKing, cfg.hp).getElement()
	);
	
	// конфиг героев
	const heroesConfig = [
		...Array(4).fill({ texture: allTextureKeys.minotaur1Idle, heroType: labels.heroOne }),
		...Array(4).fill({ texture: allTextureKeys.gunslinger1Idle, heroType: labels.heroTwo })
	];
	
	// создаём героев
	const heroes = heroesConfig.map((cfg, i) =>
		new CharacterElement(app, cfg.texture, true, false, 1, cfg.heroType, i).getElement()
	);
	
	// добавляем в контейнер
	sceneBgContainer.addChild(sceneBackgroundElement, titleEnemies, titleUser, ...enemies, ...heroes);
	
	// ---- Layout ----
	function setPosition() {
		sceneBgContainer.position.set(app.renderer.width / 2, app.renderer.height / 2);
		sceneBackgroundElement.position.set(0, 0);
		
		// заголовки
		titleEnemies.position.set(
			-sceneBackgroundElement.width / 2 + titleEnemies.width / 1.6,
			-sceneBackgroundElement.height / 2 + titleEnemies.height / 1.3
		);
		
		titleUser.position.set(
			-sceneBackgroundElement.width / 1.75 + titleUser.width / 1.6,
			sceneBackgroundElement.height / 6 + titleUser.height / 1.2
		);
		
		// позиции врагов (массив координат)
		const enemyPositions = [
			[0, -enemies[0].height / 2],
			[-enemies[1].width / 1.3, -enemies[1].height / 2],
			[-enemies[2].width / 0.65, -enemies[2].height / 2],
			[-enemies[3].width / 0.65, -enemies[3].height / 0.8],
			[-enemies[4].width / 1.1, -enemies[4].height / 0.6],
			[-enemies[5].width / 12, -enemies[5].height / 0.6],
			[sceneBackgroundElement.width / 4, -sceneBackgroundElement.height / 13]
		];
		
		enemies.forEach((enemy, i) => enemy.position.set(...enemyPositions[i]));
		
		// позиции героев
		const heroPositions = [
			[sceneBackgroundElement.width / 8, sceneBackgroundElement.height / 8],
			[sceneBackgroundElement.width / 3.6, sceneBackgroundElement.height / 4],
			[-sceneBackgroundElement.width / 38, sceneBackgroundElement.height / 5],
			[-sceneBackgroundElement.width / 3.6, sceneBackgroundElement.height / 4],
			[-heroes[4].width / 1.4, sceneBackgroundElement.height / 4],
			[0, sceneBackgroundElement.height / 15],
			[sceneBackgroundElement.width / 3.6, sceneBackgroundElement.height / 7.5],
			[-heroes[7].width / 0.7, sceneBackgroundElement.height / 15]
		];
		
		heroes.forEach((hero, i) => hero.position.set(...heroPositions[i]));
	}
	
	function onResizeHandler() {
		setPosition();
	}
	
	setPosition();
	return sceneElement;
}
