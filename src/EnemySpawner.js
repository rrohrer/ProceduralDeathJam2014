TANK.registerComponent("EnemySpawner")
.requires("Pos2D")
.construct( function ()
{
  this.enemiesToSpawn = [];
  this.ticksTillSpawn = 5;
  this.ticksRemaining = this.ticksTillSpawn;

  //configure the spawner
  this.configure = function (x, y, enemies, ticks)
  {
    this.parent.Pos2D.x = x;
    this.parent.Pos2D.y = y;
    this.enemiesToSpawn = typeof enemies !== 'undefined' ? enemies : this.enemiesToSpawn;
    this.ticksTillSpawn = typeof ticks !== 'undefined' ? ticks : this.ticksTillSpawn;
  };
})
.initialize(function ()
{
  //called whenever the game updates
  this.addEventListener("OnGameTick", function ()
  {
    if (0 === --this.ticksRemaining)
    {
      this.ticksRemaining = this.ticksTillSpawn;

      //spawn enemy
    }
  });
});
