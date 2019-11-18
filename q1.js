function question1() {
    let data = q1DataPrep(store.aid);


    let svg = d3.select("#q1"),
        margin = {top: 20, right: 20, bottom: 100, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // The scale spacing the groups:
    let x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    // The scale for spacing each group's bar:
    let x1 = d3.scaleBand()
        .padding(0.05);

    let y = d3.scaleLinear()
        .rangeRound([height, 0]);

    let z = d3.scaleOrdinal()
        .range([
            "#238b45",
            "#d94801",
        ]);
    console.log(data);
    let keys = ["donate", "receive"];

    console.log('keys');
    console.log(keys);
    x0.domain(data.map(function (d) {
        return d.country;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);

    let valueMax = -Infinity;
    for(let i = 0; i < data.length; i++){
        let cur = data[i];
        if(cur.donate > valueMax){
            valueMax = cur.donate
        }
        if(cur.receive > valueMax){
            valueMax = cur.receive
        }
    }

    y.domain([0, valueMax]).nice();

    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) {
            return "translate(" + x0(d.country) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
            return keys.map(function (key) {
                return {key: key, value: d[key]};
            });
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x1(d.key);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("fill", function (d) {
            return z(d.key);
        });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "rotate(45)");
    ;

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("$");

    let legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 17)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", z)
        .attr("stroke", z)
        .attr("stroke-width", 2)


    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });


}

function q1DataPrep(rawData) {
    console.log("q1DataPrep");
    let donor = groupByCountry(rawData, 'd');
    let receiver = groupByCountry(rawData, 'r');
    let recordMap = new Map();
    for (let key in donor) {
        let country = donor[key].country;
        let amount = donor[key].amount;
        if (recordMap[country] === undefined) {
            recordMap[country] = {};
            recordMap[country]["country"] = country;
            recordMap[country]["donate"] = amount;
        } else {
            recordMap[country]["donate"] = amount;
        }
    }

    for (let key in receiver) {
        let country = receiver[key].country;
        let amount = receiver[key].amount;
        if (recordMap[country] === undefined) {
            recordMap[country] = {};
            recordMap[country]["country"] = country;
            recordMap[country]["receive"] = amount;
        } else {
            recordMap[country]["receive"] = amount;
        }
    }

    let recordList = [];
    for (let key in recordMap) {
        recordList.push(recordMap[key]);
    }
    recordList.sort(function (a, b) {
            let keyA = a.donate;
            let keyB = b.donate;
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        }
    );
    return recordList;
}
