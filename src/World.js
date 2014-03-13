//start the component
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
    "#aaa",
    "#555",
    "#f0f"
  ];
  this.bgColors = ["#555", "#733", "#373", "#337"];
  this.bgColorIndex = 0;

  this.zdepth = 0;
  this.cellWidth = 8;
  this.cellHeight = 8;
  this.numCellsWide = 16;
  this.numCellsTall = 16;
  this.worldWidth = this.cellWidth * this.numCellsWide;
  this.worldHeight = this.cellHeight * this.numCellsTall;
  this.pixelsPerCell = 6;
  this.cells = [];

  //generate debugging colors for the cells
  for (var i = 0; i < this.numCellsWide * this.numCellsTall; i++)
  {
    this.cellColors.push(generateRandomColor3());
  }

  //for each cell, decide if it should contain a room
  this.cellsWithRooms = []
  for (var i = 0; i < this.numCellsWide * this.numCellsTall; ++i)
  {
    if (Math.random() > 0.7)
    {
      this.cellsWithRooms.push(i);
    }
  }

  this.isCellWithRooom = function (x, y)
  {
    if (x >= this.numCellsWide || x < 0) return false;
    if (y >= this.numCellsTall || y < 0) return false;
    var cellIndex = y * this.numCellsWide + x;
    return (-1 !== this.cellsWithRooms.indexOf(cellIndex));
  };
})

.initialize(function()
{
  //initialize all of the cells
  for (var i = 0; i < this.worldWidth; ++i)
  {
    this.cells[i] = [];
    for (var j = 0; j < this.worldHeight; ++j)
    {
      if (i === 0 || j === 0 || i === this.worldWidth - 1 || j === this.worldHeight - 1)
        this.cells[i][j] = 1;
      else
      {
        var cellIndex = (Math.floor(i / this.cellWidth) + Math.floor(j / this.cellHeight) * this.numCellsWide);
        var found = this.cellsWithRooms.indexOf(cellIndex);
        if (-1 == found)
        {
          this.cells[i][j] = 1//cellIndex + 3;
        }
        else //this is the case that the cell is a room
        {
          this.cells[i][j] = 0
        }
      }
    }
  }

  //collect the cells into rooms
  this.dirtyCellList = [];
  this.roomList = [];
  this.recursiveCheckAdd = function (x, y, retList)
  {
    var cellIndex = y * this.numCellsWide + x;
    if (this.isCellWithRooom(x,y) === true && -1 === this.dirtyCellList.indexOf(cellIndex))
    {
      this.dirtyCellList.push(cellIndex);
      retList.push(cellIndex);

      retList = this.recursiveCheckAdd(x + 1, y, retList);
      retList = this.recursiveCheckAdd(x - 1, y, retList);
      retList = this.recursiveCheckAdd(x, y + 1, retList);
      retList = this.recursiveCheckAdd(x, y - 1, retList);
    }

    return retList;
  }
  for (var x = 0; x < this.numCellsWide; ++x)
  {
    for (var y = 0; y < this.numCellsTall; ++y)
    {
      var cellIndex = y * this.numCellsWide + x;
      //check to see if cell index is room or dirty
      if (-1 === this.cellsWithRooms.indexOf(cellIndex) || -1 !== this.dirtyCellList.indexOf(cellIndex)) continue;
      var roomsInIsland = this.recursiveCheckAdd(x, y, []);

      var room = {indexList: roomsInIsland, isConntected: false};
      this.roomList.push(room);
    }
  }

  this.indexToCoord = function (index)
  {
    var x = index % this.numCellsWide;
    var y = (index - x) / this.numCellsTall;

    return [x, y];
  }

  this.middleTileIndex = function (room)
  {
    //calculate the extents
    var xmax = 0;
    var ymax = 0;
    var xmin = Infinity;
    var ymin = Infinity;

    for (var i = 0; i < room.indexList.length; ++i)
    {
      var location = this.indexToCoord(room.indexList[i]);
      if (xmax < this.cellWidth * location[0] + this.cellWidth) xmax = this.cellWidth * location[0] + this.cellWidth;
      if (xmin > this.cellWidth * location[0]) xmin = this.cellWidth * location[0];
      if (ymax < this.cellHeight * location[1] + this.cellHeight) ymax = this.cellHeight * location[1] + this.cellHeight;
      if (ymin > this.cellHeight * location[1]) ymin = this.cellHeight * location[1];
    }

    var actualMiddle = [xmin + Math.floor((xmax - xmin) / 2), ymin + Math.floor((ymax - ymin) / 2)];

    var mostCenterIndex = 0;
    var minDistance = Infinity;
    //calculate dist^2 of each to center
    for (var i = 0; i < room.indexList.length; ++i)
    {
      var location = this.indexToCoord(room.indexList[i]);
      var dist = (location[0] - actualMiddle[0]) * (location[0] - actualMiddle[0]) + (location[1] - actualMiddle[1]) * (location[1] - actualMiddle[1]);
      if (dist < minDistance)
      {
        minDistance = dist;
        mostCenterIndex = room.indexList[i];
      }
    }

    return mostCenterIndex;
  }

  //for each room, connect to other rooms
  if (this.roomList.length >= 1)
  {
    this.roomList[0].isConntected = true;
  }
  for (var i = 0; i < this.roomList.length; ++i)
  {
    var nextRoom = 0;
    if (this.roomList[i].isConntected === true)
    {
      //find the next non-connected room
      for (var j = i; j < this.roomList.length; ++j)
      {
        if (this.roomList[j].isConntected === false)
        {
          this.roomList[j].isConntected = true;
          nextRoom = j;
          break;
        }
      }
    }
    else
    {
      //find the next connected room
      for (var j = i; j >= 0; --j)
      {
        if (this.roomList[j].isConntected === true)
        {
          nextRoom = j;
          break;
        }
      }
    }

    //find the middle of the middle tile for each room, get Coords
    var startTile = this.indexToCoord(this.middleTileIndex(this.roomList[i]));
    var endTile = this.indexToCoord(this.middleTileIndex(this.roomList[nextRoom]));

    //calculate world pos for each
    var xStart = startTile[0] * this.cellWidth + Math.floor(this.cellWidth / 2);
    var yStart = startTile[1] * this.cellHeight + Math.floor(this.cellHeight / 2);

    var xEnd = endTile[0] * this.cellWidth + Math.floor(this.cellWidth / 2);
    var yEnd = endTile[1] * this.cellHeight + Math.floor(this.cellHeight / 2);

    //decide weather to traverse X or Y first and make the path
    if (Math.random() > 0.5)
    {
      var direction = 1;
      if (xStart > xEnd)
      {
        direction = -1;
      }
      for (var xi = xStart; xi != xEnd; xi += direction)
      {
        this.cells[xi][yStart] = 0;
      }

      direction = 1;
      if (yStart > yEnd)
      {
        direction = -1;
      }
      for (var yi = yStart; yi != yEnd; yi += direction)
      {
        this.cells[xEnd][yi] = 0;
      }
    }
    else
    {
      var direction = 1;
      if (yStart > yEnd)
      {
        direction = -1;
      }
      for (var yi = yStart; yi != yEnd; yi += direction)
      {
        this.cells[xStart][yi] = 0;
      }

      direction = 1;
      if (xStart > xEnd)
      {
        direction = -1;
      }
      for (var xi = xStart; xi != xEnd; xi += direction)
      {
        this.cells[xi][yEnd] = 0;
      }
    }

    this.addEventListener("AudioBeatEvent", function ()
    {
      this.bgColorIndex = (this.bgColorIndex + 1) % this.bgColors.length;
      this.cellColors[1] = this.bgColors[this.bgColorIndex];
    });
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
