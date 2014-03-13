TANK.registerComponent("Game")

.construct(function()
{
})

.initialize(function()
{
  var e = TANK.createEntity("Player");
  e.Pos2D.x = TANK.World.playerStartX;
  e.Pos2D.y = TANK.World.playerStartY;
  TANK.addEntity(e); //, "name"); then you can get TANK.getEntity();
});
