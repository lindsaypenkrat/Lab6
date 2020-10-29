  function StackedAreaChart(container){
// initialization

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    //let selected = null, xDomain, data;

    let chart = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3
        .scaleTime()
        .range([0,width]);

    let yScale = d3
        .scaleLinear()
        .range([height,0]);

    let colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10); //CHANGE IF TIME


    const xAxis = d3.axisBottom()
        .scale(xScale)
    
    const yAxis = d3.axisLeft()
        .scale(yScale)

    const tooltip=chart.append('text')
        .attr('x',150)
        .attr('y',100)
        .attr('font-size',16)

    chart.append("g")
        .attr("class", "axis x-axis")
    chart.append("g")
        .attr("class", "axis y-axis")

    chart.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)// the size of clip-path is the same as
        .attr("height", height);  


    chart.append('text')
        .attr('x',50)
        .attr('y',-10)
        .attr('class','yTitle')
        .style('text-anchor','end')
        .text("# Unemployed")
        .attr('font-size',13)
        
    chart.append('text')
        .attr('x',width/2+10)
        .attr('y',height+30)
        .attr('class','xTitle')
        .style('text-anchor','end')
        .text("Year")
        .attr('font-size',13)
    


    function update(data){  // update scales, encodings, axes (use the total count)

        let keys = data.columns.slice(1);
        let stack = d3
            .stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)
        
        let dataStack = stack(data)

        xScale.domain(d3.extent(data, d => d.date))
        yScale.domain([0, d3.max(dataStack,a => d3.max(a, d=>d[1]))])
        colorScale.domain(keys)

        chart.select('.x-axis')
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis)

		chart.select('.y-axis')
            .call(yAxis)
            
        let area = d3.area()
            .x(d => xScale(d.data.date))
            .y1(d => yScale(d[1]))
            .y0((d) => yScale(d[0]))

        const areas = chart.selectAll('.area')
            .data(dataStack, d => d.key)

        areas
            .enter()
            .append('path')
            .attr('class', 'area')

            .style('fill', d => colorScale(d.key))
            .merge(areas)
            .on("mouseover", (event, d) => tooltip.text(d.key))
            .on("mouseout", (event) => tooltip.text(''))
            .attr('d', area)
            .attr('clip-path','url(#area)')
            /*.on("click", (event, d) => {
                // toggle selected based on d.key
                if (selected === d.key) {
              selected = null;
            } else {
                selected = d.key;
            }
            update(data); // simply update the chart again
            })*/
        
        areas.exit().remove()
        
    }

    return {
        update 
    }
}
export default StackedAreaChart