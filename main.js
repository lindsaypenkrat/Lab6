import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

var unemployTotal;

d3.csv('unemployment.csv', d3.autoType)
    .then(data=>{ 
        unemployTotal = data
        let oneYear = unemployTotal.columns.slice(1)
        unemployTotal.forEach(year => {
            let sum = 0
            oneYear.forEach(industry => sum += year[industry])
            year.total = sum
        });

        console.log( unemployTotal[1])

        const chart = AreaChart(".area_chart")
        chart.update(unemployTotal)
        const stackedChart = StackedAreaChart(".stacked_chart")
        stackedChart.update(unemployTotal)

        chart.on("brushed", (range)=>{
            stackedChart.filterByDate(range); // coordinating with stackedAreaChart
        })
})