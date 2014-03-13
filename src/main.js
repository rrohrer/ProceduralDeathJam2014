function main()
{
  lowLag.init();

  TANK.addComponents("World, AudioEngine, Game, InputManager, RenderManager");

  TANK.RenderManager.context = document.getElementById("canvas").getContext("2d");
  TANK.InputManager.context = document.getElementById("stage");

  //TANK.start();
  //OnEnterFrame dt in seconds
  //OnGameTick
  //TANK.dispatchEvent("", ards)
  //obj.invoke("args", args) calls function with that name
  //construct instantiates
  //initialize adds to game -> events must happen here
  //destruct -> called when entity is removed for reals
}
