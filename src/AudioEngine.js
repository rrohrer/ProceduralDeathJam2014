TANK.registerComponent("AudioEngine")
.construct( function ()
{
  this.backgroundMusic = new Audio("data/background.mp3");
  this.backgroundMusicLoaded = false;
  var parent = this;
  this.backgroundMusic.addEventListener("canplaythrough", function ()
  {
    parent.backgroundMusicLoaded = true;
  });
  this.backgroundMusic,addEventListener("ended", function()
  {
    this.currentTime = 0;
    this.play();
  }, false);

})
.initialize(function ()
{
  //called whenever webkit updates
  this.addEventListener("OnEnterFrame", function (dt)
  {

  });
});
