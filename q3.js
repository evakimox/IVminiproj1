function question3() {
    let aidRawData = store.aid;
    //console.log(aidRawData);
    let aggByPurpose = groupByPurpose(aidRawData);
    console.log(aggByPurpose)

    for(let i = 0; i < 5; i++){
        let explainPosition = "q3w" + (i+1).toString();
        document.getElementById(explainPosition).innerHTML = "purpose " + (i+1).toString();
        //drawMap3(store.geoJSON, aggByPurpose, i);
    }


}

function drawMap3(geoJson, dataSet, hueIndex) {
    let config = getQ3MapConfig(hueIndex);
    let projection = getQ3MapProjection(config);
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
    drawQ3Map(config.container, geoJson.features, projection, minVal, maxVal, hueIndex);
}

function getQ3MapConfig(hueIndex) {
    let width = 330;
    let height = 220;
    let mapId = "#q3m" + (hueIndex+1).toString();
    let container = d3.select(mapId);
    container.attr("width", width);
    container.attr("height", height);
    return {width, height, container}
}


function getQ3MapProjection(config) {
    let {width, height} = config;
    let projection = d3.geoMercator();
    projection.scale(63)
        .translate([width / 2, height / 2 + 20])
    store.mapProjection = projection;
    return projection;
}

function drawQ3Map(container, countries, projection, minVal, maxVal, hueIndex) {

    let highColors = [
        "#672044",
        "#63589f",
        "#074050",
        "#ee4d5a",
        "#2a5674"
    ];
    let lowColors = [
        "#ffc6c4",
        "#f3e0f7",
        "#d3f2a3",
        "#ecda9a",
        "#d1eeea"
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
    let w = 140, h = 220;
    let legendId = "#q3l" + (hueIndex+1).toString();
    let key = d3.select(legendId)
        .attr("width", w)
        .attr("height", h)
        .attr("class", "legend");
    let gradientId = "gradient-q3" + (hueIndex+1).toString();
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