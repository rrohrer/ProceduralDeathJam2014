TANK.registerComponent("World")

.interfaces("Drawable")

.construct(function()
{
  // Cell Definitions
  // 0 - Floor
  // 1 - Wall
  // 2 - Door

  this.cellColors =
  [
    "#111",
    "#aaa",
    "#555"
  ];

  this.zdepth = 0;
  this.cellWidth = 16;
  this.cellHeight = 16;
  this.numCellsWide = 8;
  this.numCellsTall = 8;
  this.worldWidth = this.cellWidth * this.numCellsWide;
  this.worldHeight = this.cellHeight * this.numCellsTall;
  this.pixelsPerCell = 4;
  this.cells = [];
})

.initialize(function()
{
  for (var i = 0; i < this.worldWidth; ++i)
  {
    this.cells[i] = [];
    for (var j = 0; j < this.worldHeight; ++j)
    {
      if (i === 0 || j === 0 || i === this.worldWidth - 1 || j === this.worldHeight - 1)
        this.cells[i][j] = 1;
      else
        this.cells[i][j] = 0;
    }
  }

  this.getCellAt = function(x, y)
  {
    return this.cells[x][y];
  };

  this.draw = function(ctx, camera)
  {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    for (var i = 0; i < this.worldWidth; ++i)
    {
      for (var j = 0; j < this.worldHeight; ++j)
      {
        var cell = this.cells[i][j];
        var color = this.cellColors[cell];
        ctx.fillStyle = color;
        ctx.fillRect(i * this.pixelsPerCell, j * this.pixelsPerCell, this.pixelsPerCell, this.pixelsPerCell);
      }
    }
    ctx.restore();
  };
});
