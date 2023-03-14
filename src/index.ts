import { Application, Sprite, Texture, Ticker, Text} from 'pixi.js'
import { sound } from '@pixi/sound';
import * as PIXI from "pixi.js";
import { Chest, Values } from "./chest";
import { Tween , Group, Easing} from "tweedle.js";
import * as particles from '@pixi/particle-emitter';

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
app.stage.sortableChildren = true;

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


/* ************ REWARD PANEL ******************  */
const rewardPanelText: Texture = PIXI.Texture.from("Panel 2.png");

const rewardPanel: Sprite = new PIXI.Sprite(rewardPanelText);
rewardPanel.anchor.set(0.5);
rewardPanel.x = appWidth/2 +20;
rewardPanel.y = appHeight/2 -20;
rewardPanel.width = appWidth*0.5;
rewardPanel.height = appHeight*0.7;
rewardPanel.alpha = 1;
rewardPanel.zIndex = 2;
rewardPanel.visible = false;
rewardPanel.interactive = true;

rewardPanel.on("pointerdown", () => {
	sound.stopAll();
	HideRewardPanel();
	if(CheckAllChestOpened())
		ResetGame();
	else
		SetChestsInteractive(true);
});

app.stage.addChild(rewardPanel);

// REWARD TEXT
const rewardText = new Text('Congratulations!', {fontFamily: 'Impact,Charcoal,sans-serif',
	fontSize: 90,
	letterSpacing: 4,
	fontWeight: "400",
	fill: 0xfeeebc,
	align: 'center',
});
rewardText.anchor.set(0.5);
rewardText.x = 0;
rewardText.y = -380;
rewardText.alpha = 1;
rewardText.visible = false;
rewardPanel.addChild(rewardText);

// BIT WIN MESSAGE
const rewardTypeText = new Text('BIG WIN!', {fontFamily: 'Impact,Charcoal,sans-serif',
	fontSize: 90,
	letterSpacing: 4,
	fontWeight: "400",
	fill: 0x000000,
	align: 'center',
});
rewardTypeText.anchor.set(0.5);
rewardTypeText.x = 0;
rewardTypeText.y = -200;
rewardTypeText.alpha = 1;
rewardTypeText.visible = false;
rewardPanel.addChild(rewardTypeText);


// Coins Texture
const CoinText: Texture = PIXI.Texture.from("Coin.png");

// AMOUNT WON
const amountWonText = new Text('5.00€', {fontFamily: 'Impact,Charcoal,sans-serif',
	fontSize: 180,
	letterSpacing: 4,
	fontWeight: "400",
	fill: 0x000000,
	align: 'center',
});
amountWonText.anchor.set(0.5);
amountWonText.x = 0;
amountWonText.y = 50;
amountWonText.alpha = 1;
amountWonText.visible = false;
rewardPanel.addChild(amountWonText);

// Bonus Logo
const BonusLogoText: Texture = PIXI.Texture.from("bonus_image.png");

const BonusLogo: Sprite = new PIXI.Sprite(BonusLogoText);
BonusLogo.anchor.set(0.5);
BonusLogo.x = appWidth/2;
BonusLogo.y = appHeight/2;
BonusLogo.width = appWidth*1;
BonusLogo.height = appHeight*1.2;
BonusLogo.alpha = 1;
BonusLogo.zIndex = 3;
BonusLogo.visible = false;

app.stage.addChild(BonusLogo);

// Lose Logo
const LoseLogoText: Texture = PIXI.Texture.from("lose_image.png");

const LoseLogo: Sprite = new PIXI.Sprite(LoseLogoText);
LoseLogo.anchor.set(0.5);
LoseLogo.x = appWidth/2;
LoseLogo.y = appHeight/2;
LoseLogo.width = appWidth*1;
LoseLogo.height = appHeight*1.2;
LoseLogo.alpha = 1;
LoseLogo.zIndex = 3;
LoseLogo.visible = false;

app.stage.addChild(LoseLogo);

/* ************ END REWARD PANEL ******************  */



/* ************ PARTICLES ******************  */

var rewardEmitter = new particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    rewardPanel,
    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        lifetime: {
            min: 0.5,
            max: 0.6
        },
        frequency: 0.008,
        spawnChance: 1,
        particlesPerWave: 1,
        emitterLifetime: 3,
        maxParticles: 50,
        pos: {
            x: 0,
            y: -100
        },
        addAtBack: false,
        behaviors: [
            {
                type: 'alpha',
                config: {
                    alpha: {
                        list: [
                            {
                                value: 0.7,
                                time: 0
                            },
                            {
                                value: 0.1,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'scale',
                config: {
                    scale: {
                        list: [
                            {
                                value: 0.4,
                                time: 0
                            },
                            {
                                value: 0.07,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 90,
                                time: 0
                            },
                            {
                                value: 10,
                                time: 1
                            }
                        ],
                        isStepped: true
                    },
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: 0,
                    max: 360
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'torus',
                    data: {
                        x: 0,
                        y: 0,
                        radius: 150
                    }
                }
            },
            {
                type: 'textureSingle',
                config: {
                    texture: CoinText
                }
            }
        ],
    }
);
var bonusEmitter = new particles.Emitter(

    // The PIXI.Container to put the emitter in
    // if using blend modes, it's important to put this
    // on top of a bitmap, and not use the root stage Container
    rewardPanel,
    // Emitter configuration, edit this to change the look
    // of the emitter
    {
        lifetime: {
            min: 0.5,
            max: 1
        },
        frequency: 0.02,
        spawnChance: 4,
        particlesPerWave: 2,
        emitterLifetime: 3,
        maxParticles: 1000,
        pos: {
            x: 0,
            y: 0
        },
        addAtBack: false,
        behaviors: [
            {
                type: 'alpha',
                config: {
                    alpha: {
                        list: [
                            {
                                value: 0.8,
                                time: 0
                            },
                            {
                                value: 0.1,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'scale',
                config: {
                    scale: {
                        list: [
                            {
                                value: 0.4,
                                time: 0
                            },
                            {
                                value: 0.07,
                                time: 1
                            }
                        ],
                    },
                }
            },
            {
                type: 'moveSpeed',
                config: {
                    speed: {
                        list: [
                            {
                                value: 200,
                                time: 0
                            },
                            {
                                value: 10,
                                time: 1
                            }
                        ],
                        isStepped: true
                    },
                }
            },
            {
                type: 'rotationStatic',
                config: {
                    min: 0,
                    max: 360
                }
            },
            {
                type: 'spawnShape',
                config: {
                    type: 'rect',
					data: {
						x: -appWidth/2,
						y: -appHeight/2,
						w: appWidth,
						h: appHeight
					}
                }
            },
            {
                type: 'textureSingle',
                config: {
                    texture: CoinText
                }
            }
        ],
    }
);


/* ************ END PARTICLES ******************  */




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

sound.add('empty_chest', 'sounds/lose_sound.wav');
sound.speed('empty_chest',0.9);
sound.volume('empty_chest',0.5);

sound.add('reward_chest', 'sounds/reward_chest.wav');
sound.speed('reward_chest',0.9);
sound.volume('reward_chest',0.5);

sound.add('bonus_chest', 'sounds/victory_sound.wav');
sound.speed('bonus_chest',0.7);
sound.volume('bonus_chest',0.1);

sound.add('coins', 'sounds/coins.wav');
sound.speed('coins',0.8);
sound.volume('coins',1);

var gameChests : Chest [] = []; 

const moneyCounter = { val:0};
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
						rewardTypeText.text = "BIG WIN!";
						sound.play('reward_chest');
						sound.volume('coins',1);
						break;
					case Values.Bonus:
						chest.sprite.texture = chestRedOpened;
						rewardTypeText.text = "BOOOOOONUUUS WIN!";
						sound.volume('coins',2);
						sound.play('bonus_chest');
						break;	
				}
				
				new Tween(chest.sprite).to({ }, 100).repeat(6).start().onComplete(()=>{

					if(chest.reward != Values.Empty){
						var rewardPanelTween = new Tween(rewardPanel.scale).from({x:0,y:0}).to({ x: 0.5,y: 0.5 }, 1000).easing(Easing.Quartic.InOut).onStart(()=>{
							rewardTypeText.visible = true;
							rewardText.visible = true;
							sound.play('coins');

							rewardPanel.visible = true; 
							if(chest.reward == Values.Bonus)
								bonusEmitter.emit = true;
							else
								rewardEmitter.emit = true;
						}).onRepeat(()=>{
							sound.play('shakeChest');
						}).onComplete(()=>{
							new Tween(rewardPanel).to({ x: rewardPanel.x+5,y: rewardPanel.y+5  }, 500).repeat(4).yoyo(true).easing(Easing.Back.Out).start().onRepeat(()=>{
								sound.play('coins');
							});
							
							amountWonText.visible = true;
							console.log(chest.prize);
							moneyCounter.val = 0;
							var test = new Tween(moneyCounter).from(0).to({val:chest.prize}, 2000).easing(Easing.Exponential.Out).start().onUpdate(()=>{
								if(!rewardPanel.visible){
									HideRewardPanel();
									test.stop();
									return;
								}
								amountWonText.text = moneyCounter.val.toFixed(2)+" €";
							}).onComplete(()=>{
								sound.stop('coins');
								rewardEmitter.emit = false;
								bonusEmitter.emit = false;
								new Tween(chest.sprite).to({ }, 100).repeat(15).start().onComplete(()=>{
									HideRewardPanel();
									sound.stopAll();
									if(CheckAllChestOpened())
										ResetGame();
									else
										SetChestsInteractive(true);
								});
							});
							
						});
						
						if(chest.reward == Values.Bonus){

							new Tween(BonusLogo.scale).from({x:0,y:0}).to({ x: 1,y: 0.8 }, 2000).start().easing(Easing.Quartic.InOut).onStart(()=>{
								BonusLogo.visible = true; 
							}).onComplete(()=>{
								new Tween(BonusLogo.scale).from({x:1,y:0.8}).to({ x: 0,y: 0 }, 2000).start().easing(Easing.Quartic.InOut).onStart(()=>{
									rewardPanelTween.start();
								}).onComplete(()=>{
									BonusLogo.visible = false;
								});
							})
						}else{
							rewardPanelTween.start();
						}
						// rewardTypeText.visible = true;
						// rewardText.visible = true;
						//sound.play('coins');
						
					}else{
						new Tween(LoseLogo.scale).from({x:0,y:0}).to({ x: 0.7,y: 0.5 }, 2000).start().easing(Easing.Quartic.InOut).onStart(()=>{
							LoseLogo.visible = true; 
							sound.play("empty_chest");
						}).onComplete(()=>{
							new Tween(LoseLogo.scale).from({x:0.7,y:0.5}).to({ x: 0,y: 0 }, 2000).start().easing(Easing.Quartic.InOut)
							.onStart(()=>{
								sound.play("empty_chest");
							})
							.onComplete(()=>{
								LoseLogo.visible = false;
								if(CheckAllChestOpened())
									ResetGame();
								else
									SetChestsInteractive(true);
							});
						})
					}
				});
				


				//chest.Debug();
			});
		});
	});
}

function HideRewardPanel(){
	if(!rewardPanel.visible)
		return;
	rewardPanel.visible = false;
	rewardTypeText.visible = false;
	rewardText.visible = false;
	amountWonText.visible = false;
	moneyCounter.val = 0;
	amountWonText.text = "";
	bonusEmitter.emit = false;
	rewardEmitter.emit = false;
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
// Calculate the current time
var elapsed = Date.now();
function update(): void {
	// Update the next frame
	requestAnimationFrame(update);

	var now = Date.now();

	// The emitter requires the elapsed
	// number of seconds since the last update
	bonusEmitter.update((now - elapsed) * 0.001);
	rewardEmitter.update((now - elapsed) * 0.001);
	elapsed = now;
	Group.shared.update()
}