function generateRandomRange(min, max)
{
  return Math.random() * (max - min) + min;
}

function generateRandomIntegerRange(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomColor3()
{
  var r = generateRandomIntegerRange(3, 11);
  var g = generateRandomIntegerRange(3, 11);
  var b = generateRandomIntegerRange(3, 11);
  return "#" + r.toString(16) + g.toString(16) + b.toString(16);
}
