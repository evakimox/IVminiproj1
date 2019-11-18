function question1(){
    let aidRawData = store.aid;
    let aggAsDonor = groupByCountry(aidRawData, 'd');
    let aggAsRecepient = groupByCountry(aidRawData, 'r');
    drawGroupedColumnChart(aggAsDonor, aggAsRecepient);
}

function drawGroupedColumnChart(set1, set2){
    let config = q1Config();
    let scales = q1Scales(set1, set2, config);
    drawBars(set1, set2, scales, config);
}

function q1Config(){
    let width = 600;
    let height = 400;
    let margin = {
        top: 10,
        bottom: 50,
        left: 100,
        right: 10
    }
    let bodyHeight = height - margin.top - margin.bottom;
    let bodyWidth = width - margin.left - margin.right;
    let container = d3.select("#q1");
    container.attr("width", width);
    container.attr("height", height);
    return {width, height, margin, bodyHeight, bodyWidth, container}
}

function q1Scales(set1, set2, config){
    let {bodyWidth, bodyHeight} = config;
    let maximum1 = d3.max(set1);
    let maximum2 = d3.max(set2);
    let maximum = Math.max(maximum1.amount, maximum2.amount);
    let names = [];
    for(let i = 0; i < set1.length; i++){
        let row = set1[i];
        if(!names.includes(row.country)){
            names.push(row.country);
        }
    }
    for(let i = 0; i < set2.length; i++){
        let row = set2[i];
        if(!names.includes(row.country)){
            names.push(row.country);
        }
    }

    let xScale = d3.scaleBand().range([0, bodyWidth]).domain(names);
    let yScale = d3.scaleLinear()
        .range([0, bodyHeight])
        .domain([0, maximum]);

    return {xScale, yScale};
}

function drawBars(set1, set2, scales, config){
    let {margin, container} = config;
    let {xScale, yScale} = scales;
    let body = container.append("g")
        .style("transform",
            `translate(${margin.left}px,${margin.top}px)`
        )
    let bars = body.selectAll(".bar").data(set1);
    bars.enter().append("rect")
        .attr("width", xScale.bandwidth())
        .attr("x", (d) => xScale(d.country))
        .attr("height", (d) => yScale(d.amount))
        .attr("fill", "#2a5599")
}