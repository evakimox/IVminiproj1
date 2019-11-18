function question2() {
    let aidRawData = store.aid;
    let aggAsDonor = groupByCountryMapped(aidRawData, 'd');
    let aggAsRecepient = groupByCountryMapped(aidRawData, 'r');

    drawMap(store.geoJSON, aggAsDonor, 0);
    drawMap(store.geoJSON, aggAsRecepient, 1);
}

function drawMap(geoJson, dataSet, hueIndex) {
    let config = getMapConfig(hueIndex);
    let projection = getMapProjection(config);
    let geoInfo = geoJson;
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let i = 0; i < geoJson.features.length; i++) {
        let geoCountry = geoJson.features[i];
        let name = geoCountry.properties.name;
        if (dataSet[name] !== undefined) {
            geoInfo.features[i].properties.amount = dataSet[name].amount;
            if (minVal > dataSet[name].amount) {
                minVal = dataSet[name].amount;
            }
            if (maxVal < dataSet[name].amount) {
                maxVal = dataSet[name].amount;
            }
        } else {
            geoInfo.features[i].properties.amount = NaN;
        }
    }
    drawBaseMap(config.container, geoJson.features, projection, minVal, maxVal, hueIndex);
}

function getMapConfig(hueIndex) {
    let width = 450;
    let height = 300;
    let mapId = "#q2m" + (hueIndex+1).toString();
    let container = d3.select(mapId);
    container.attr("width", width);
    container.attr("height", height);
    return {width, height, container}
}


function getMapProjection(config) {
    let {width, height} = config;
    let projection = d3.geoMercator();
    projection.scale(80)
        .translate([width / 2, height / 2 + 20])
    store.mapProjection = projection;
    return projection;
}

function drawBaseMap(container, countries, projection, minVal, maxVal, hueIndex) {
    let highColors = [
        "#005a32",
        "#990000"
    ];
    let lowColors = [
        "#d9f0a3",
        "#fdd49e"
    ]

    let highColor = highColors[hueIndex];
    let lowColor = lowColors[hueIndex];

    let scale = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor]);

    let path = d3.geoPath().projection(projection);
    container.selectAll("path").data(countries)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke", "#fff")
        .attr("fill", function (data) {
            if (isNaN(data.properties.amount)) {
                return "#ccc";
            } else {
                return scale(data.properties.amount);
            }
        })
    let w = 140, h = 300;
    let legendId = "#q2l" + (hueIndex+1).toString();
    let key = d3.select(legendId)
        .attr("width", w)
        .attr("height", h)
        .attr("class", "legend");
    let gradientId = "gradient" + (hueIndex+1).toString();
    let legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", gradientId)
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1);
    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1);
    key.append("rect")
        .attr("width", w - 100)
        .attr("height", h)
        .style("fill", "url(#"+gradientId+")")
        .attr("transform", "translate(0,10)");
    let y = d3.scaleLinear()
        .range([h, 0])
        .domain([minVal, maxVal]);
    let yAxis = d3.axisRight(y);
    key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41,10)")
        .call(yAxis)
}
