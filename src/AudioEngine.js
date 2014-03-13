TANK.registerComponent("AudioEngine")
.construct( function ()
{
  this.backgroundMusic = new Audio("data/music.mp3");
  this.hasInitOnce = false;
  var parent = this;
  this.backgroundMusic.addEventListener("canplaythrough", function ()
  {
    this.play();
    if (parent.hasInitOnce === false)
    {
      parent.hasInitOnce = true;
      TANK.start();
    }
  });
  this.backgroundMusic.addEventListener("ended", function()
  {
    this.currentTime = 0;
    this.play();
    parent.currentAudioClock = 0.0;
  }, false);
  this.backgroundMusic.load();

  //music sync options
  this.bpm = 132.0;
  this.gameUpdateBeat = 0.5;
  this.currentAudioClock = 0.0;

  this.audioBeatEventValue = 60.0 / (this.bpm / this.gameUpdateBeat);
})
.initialize(function ()
{
  //called whenever webkit updates
  this.addEventListener("OnEnterFrame", function (dt)
  {
    this.currentAudioClock += dt;

    if (this.currentAudioClock >= this.audioBeatEventValue)
    {
      this.currentAudioClock = 0.0;
      TANK.dispatchEvent("AudioBeatEvent");
    }
  });
});
