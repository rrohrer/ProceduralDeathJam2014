TANK.registerComponent("Player")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 1;
  this.timeSinceBeat = 0.0;
  this.beatForgiveness = TANK.AudioEngine.audioBeatEventValue * 0.43;
  this.pressedThisBeat = false;
  this.pressedTimer = 0.0;
  this.processKeyboardInput = function (keycode)
  {
    if (keycode === TANK.Key.W)
    {
      var cell = TANK.World.getCellAt(this.parent.Pos2D.x, this.parent.Pos2D.y - 1);
      if (cell === 0)
        this.parent.Pos2D.y -= 1;
    }
    if (keycode === TANK.Key.A)
    {
      var cell = TANK.World.getCellAt(this.parent.Pos2D.x - 1, this.parent.Pos2D.y);
      if (cell === 0)
        this.parent.Pos2D.x -= 1;
    }
    if (keycode === TANK.Key.S)
    {
      var cell = TANK.World.getCellAt(this.parent.Pos2D.x, this.parent.Pos2D.y + 1);
      if (cell === 0)
        this.parent.Pos2D.y += 1;
    }
    if (keycode === TANK.Key.D)
    {
      var cell = TANK.World.getCellAt(this.parent.Pos2D.x + 1, this.parent.Pos2D.y);
      if (cell === 0)
        this.parent.Pos2D.x += 1;
    }
  };
})

.initialize(function()
{
  this.addEventListener("OnKeyPress", function(keycode)
  {
    //check to see if it's close enough to a beat
    if (false === this.pressedThisBeat && (this.timeSinceBeat <= this.beatForgiveness || this.timeSinceBeat >= (TANK.AudioEngine.audioBeatEventValue - this.beatForgiveness)))
    {
      this.processKeyboardInput(keycode);
      this.pressedThisBeat = true;
    }
  });

  this.addEventListener("AudioBeatEvent", function ()
  {
    this.timeSinceBeat = 0.0;
  });

  this.addEventListener("OnEnterFrame", function (dt)
  {
    this.timeSinceBeat += dt;
    if (true === this.pressedThisBeat)
    {
      this.pressedTimer += dt;
    }
    if (this.pressedTimer >=  (TANK.AudioEngine.audioBeatEventValue - this.beatForgiveness / 2))
    {
      this.pressedTimer = 0.0;
      this.pressedThisBeat = false;
    }

    //update the camera
    TANK.RenderManager.camera.x = TANK.RenderManager.camera.x + (this.parent.Pos2D.x - TANK.RenderManager.camera.x) * 0.1;
    TANK.RenderManager.camera.y = TANK.RenderManager.camera.y + (this.parent.Pos2D.y - TANK.RenderManager.camera.y) * 0.1;
  });

  this.draw = function(ctx, camera)
  {
    var t = this.parent.Pos2D;

    ctx.save();
    var camTrans = calculateCameraTransform(camera);
    ctx.translate(camTrans[0], camTrans[1]);
    ctx.fillStyle = "#baf";
    ctx.fillRect(t.x * TANK.World.pixelsPerCell, t.y * TANK.World.pixelsPerCell, TANK.World.pixelsPerCell, TANK.World.pixelsPerCell);
    ctx.restore();
  };
});
