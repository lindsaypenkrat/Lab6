function AreaChart(container){

	// initialization
	const margin = { top: 20, right: 10, bottom: 30, left: 10 };
    const width = 500 - margin.left - margin.right;
	const height = 200 - margin.top - margin.bottom;
	const listeners = { brushed: null };
	
	const chart = d3
        .select(container)
        .append('svg')
        .attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
		
	let xScale = d3
		.scaleTime()
		.range([0,width])

    let yScale = d3
        .scaleLinear()
		.range([height,0])

	const xAxis = d3.axisBottom()
		.scale(xScale)

    const yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(4)



	chart.append("g")
		.attr("class", "axis x-axis")
	chart.append("g")
		.attr("class", "axis y-axis")
	
	chart.append("path")
		.attr('class', 'pathArea')

	const brush = d3.brushX()
		.extent([[0,0], [width,height]])
		.on('brush', brushed)
		.on('end', endBrush)

	chart.append("g").attr('class', 'brush').call(brush);
	
	function brushed(event) {
		if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
         }
	  }

	function endBrush(event) { //CHECK
		if (!event.selection) {
			listeners["brushed"]([xScale.invert(0), xScale.invert(width)]);
		}
	  }

	
	function update(data){  // update scales, encodings, axes (use the total count)

		xScale.domain(d3.extent(data, d => d.date))
		yScale.domain([0, d3.max(data, d => d.total)])

		chart.select('.x-axis')
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis)

		chart.select('.y-axis')
			.call(yAxis)

		let area = d3.area()
			.x(d => xScale(d.date))
			.y1(d => yScale(d.total))
			.y0(() => yScale.range()[0])

		d3.select('.pathArea')
			.datum(data)
			.attr('d', area)
    
	}

	function on(event, listener) {
		listeners[event] = listener;
  	}

	return {
		update, 
		on
	}
}
	export default AreaChart
