import { Application, Sprite, Texture, Ticker} from 'pixi.js'
import { sound } from '@pixi/sound';
import * as PIXI from "pixi.js";
import { Chest, Values } from "./chest";
import { Tween , Group} from "tweedle.js";

const appWidth : number = 1280;
const appHeight : number = 720;

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: appWidth,
	height: appHeight
});

/* ************ BACKGROUND ******************  */
const backgroundText: Texture = PIXI.Texture.from("background_pirate_theme.png");

const background: Sprite = new PIXI.Sprite(backgroundText);
background.anchor.set(0.5);
background.x = appWidth/2;
background.y = appHeight/2;
background.width = appWidth;
background.height = appHeight;

app.stage.addChild(background);

/* ************ END BACKGROUND ******************  */

/* ************ MAIN PANEL ******************  */
const MainPanelText: Texture = PIXI.Texture.from("Panel 2.png");

const mainPanel: Sprite = new PIXI.Sprite(MainPanelText);
mainPanel.anchor.set(0.5);
mainPanel.x = appWidth/2 +20;
mainPanel.y = appHeight/2 -20;
mainPanel.width = appWidth*0.75;
mainPanel.height = appHeight*0.9;
mainPanel.alpha = 0.7;

app.stage.addChild(mainPanel);

/* ************ END MAIN PANEL ******************  */


/* ************ TITLE ******************  */

// const titleText: Texture = PIXI.Texture.from("title.png");

// const title: Sprite = new PIXI.Sprite(titleText);
// title.anchor.set(0.5);
// title.x = appWidth/2 ;
// title.y = 110;
// title.width = 480;
// title.height = 230;
// title.alpha = 1;

// app.stage.addChild(title);

/* ************ END TITLE ******************  */

/* ************ LOGO IMAGE ******************  */

const logoImageText: Texture = PIXI.Texture.from("pirate_hat.png");

const logoImage: Sprite = new PIXI.Sprite(logoImageText); //340,220
logoImage.anchor.set(0.5);
logoImage.x = 115 ;
logoImage.y = 55;
logoImage.width = 110;
logoImage.height = 110;
logoImage.alpha = 1;

app.stage.addChild(logoImage);

/* ************ END LOGO IMAGE ******************  */

/* ************ LOGO ******************  */

const logoText: Texture = PIXI.Texture.from("LogoDarky.png");

const logo: Sprite = new PIXI.Sprite(logoText); //340,220
logo.anchor.set(0.5);
logo.x = 100 ;
logo.y = 125;
logo.width = 170;
logo.height = 110;
logo.alpha = 1;

app.stage.addChild(logo);

/* ************ END LOGO ******************  */

/* ************ PLAY BTN ******************  */

const playBtnText: Texture = PIXI.Texture.from("Play.png");
const playBtnHoverText: Texture = PIXI.Texture.from("Play_hover.png");
const playBtnClickedText: Texture = PIXI.Texture.from("Play_clicked.png");
const playBtnDisabledText: Texture = PIXI.Texture.from("Play_disabled.png");

const playBtn: Sprite = new PIXI.Sprite(playBtnText); //340,220
playBtn.anchor.set(0.5);
playBtn.x = appWidth/2 ;
playBtn.y = 105;
playBtn.width = 55;
playBtn.height = 55;
playBtn.alpha = 1;
SetPlayInteractive(true);
if(!playBtn.interactive){
	playBtn.texture = playBtnDisabledText;
}
playBtn.on("mouseover", () => {
	playBtn.texture = playBtnHoverText;
	
});
playBtn.on("mouseout", () => {
	if(playBtn.interactive)
		playBtn.texture = playBtnText;
});
playBtn.on("pointerdown", () => {
	playBtn.texture = playBtnClickedText;
	SetPlayInteractive(false);
	SetChestsInteractive(true);
});
// playBtn.on("pointerup", () => {
// 	playBtn.texture = playBtnHoverText;
// });

app.stage.addChild(playBtn);

/* ************ END PLAY BTN ******************  */

/* ************ CHESTS ******************  */

const chestClosed: Texture = PIXI.Texture.from("closed_chest.png");
const chestOpened: Texture = PIXI.Texture.from("opened_chest.png");
const chestBlueOpened: Texture = PIXI.Texture.from("opened_blue_chest.png");
const chestRedOpened: Texture = PIXI.Texture.from("opened_red_chest.png");
const chestClosedDisabled: Texture = PIXI.Texture.from("disabled_chest.png");
sound.add('shakeChest', 'sounds/shake.wav');
sound.speed('shakeChest',0.9);
sound.volume('shakeChest',0.2);

sound.add('open_chest', 'sounds/open_chest.m4a');
sound.speed('open_chest',0.9);
sound.volume('open_chest',0.5);

sound.add('reward_chest', 'sounds/reward_chest.wav');
sound.speed('reward_chest',0.9);
sound.volume('reward_chest',0.5);

sound.add('bonus_chest', 'sounds/victory_sound.wav');
sound.speed('bonus_chest',0.7);
sound.volume('bonus_chest',0.5);


var gameChests : Chest [] = []; 

CreateChests();

Ticker.shared.add(update, this);

function CreateChests(){
	for (let i = 0; i < 9; i++) {
		var chest : Chest = new Chest(i,new PIXI.Sprite(chestClosed),appWidth,appHeight);
		gameChests.push(chest);
		//chest.Debug();
		app.stage.addChild(chest.sprite);
	}
	SetChestsInteractive(false);
	
	gameChests.forEach(chest => {
		chest.sprite.on("pointerdown", () => {

			if(!chest.isClosed)
				return;
			SetChestsInteractive(false,chest);
			chest.isClosed = false;
			new Tween(chest.sprite).to({ x: chest.sprite.x+10,y: chest.sprite.y+5 }, 200).repeat(4).yoyo(true).start().onRepeat(()=>{
				sound.play('shakeChest');
			}).onComplete(()=>{
				sound.play('open_chest');
				switch(chest.reward){
					case Values.Empty:
						chest.sprite.texture = chestOpened;
						break;
					case Values.Reward:
						chest.sprite.texture = chestBlueOpened;
						sound.play('reward_chest');
						break;
					case Values.Bonus:
						chest.sprite.texture = chestRedOpened;
						//sound.play('bonus_chest');
						sound.play('bonus_chest');
						break;	
				}
				new Tween(chest.sprite).to({  }, 100).repeat(5).yoyo(true).start().onComplete(()=>{

					if(CheckAllChestOpened())
						ResetGame();
					else
						SetChestsInteractive(true);
				});

				//chest.Debug();
			});
		});
	});
}
function ClearChests(){
	
	gameChests.forEach(chest => {
		app.stage.removeChild(chest.sprite);
	});
	gameChests = []; 
}

function SetChestsInteractive(isInteractive: boolean, curChest?:Chest){
	gameChests.forEach(chest => {
		if(typeof curChest !== 'undefined') {
			if(chest.id == curChest.id)
				return;
		}
		if(chest.isClosed)
		{			
			chest.sprite.interactive = isInteractive;
			if (!isInteractive)
				chest.sprite.texture = chestClosedDisabled;
			else
				chest.sprite.texture = chestClosed;
		}
		else
			chest.sprite.interactive = false;
	});
}
function SetPlayInteractive(isInteractive: boolean){
	playBtn.interactive = isInteractive;
	if(isInteractive)
		playBtn.texture = playBtnText;
	else
		playBtn.texture = playBtnDisabledText;
}

function CheckAllChestOpened():boolean{
	var allOpened = true;
	gameChests.forEach(chest => {
		if(chest.isClosed)
			allOpened = false;
	});
	return allOpened;
}

function ResetGame(){
	new Tween(gameChests[1]).to({  }, 1500).repeat(1).start().onComplete(()=>{
		ClearChests();
		CreateChests();
		SetPlayInteractive(true);
	})
}
function update(): void {
	Group.shared.update()
}