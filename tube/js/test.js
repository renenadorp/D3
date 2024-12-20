<script src="https://d3js.org/d3.v6.js"></script>
<script src="../dist/d3-tube-map.js"></script>

<script>
  var container = d3.select("#tube-map");

  var width = 1600;
  var height = 1024;

  var map = d3
    .tubeMap()
    .width(width)
    .height(height)
    .margin({
      top: height / 50,
      right: width / 7,
      bottom: height / 10,
      left: width / 7,
    });

  d3.json("./pubs.json").then(function (data) {
    container.datum(data).call(map);
  });
</script>