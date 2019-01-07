<template>
<div>
  <!-- <div id="charts"></div> -->
  <div style="width:100%;height:100%;" :id="options.className ? options.className : ''">{{options}}</div>
</div>
</template>
<script>
export default {
  props: {
    options: { type: Object, default: () => { return {className: ''} } }
  },
  created() {
    // const chartEl = document.getElementById('charts');
    // const dv = document.createElement('div');
    // dv.style.width = '100%';
    // dv.style.height = '100%';
    // dv.id = this.options.className;
    // chartEl.appendChild(dv);
    // console.log('this.options',chartEl);
  },
  watch: {
    options: {
      handler(newVal,oldVal) {
        
        console.log('newVal,oldVal',newVal,oldVal);
      },
      deep: true
    }
  },
  methods: {
    initCharts(options) {
      console.log("options", options);

      if (!options) return;

      let mycharts = echarts.init(
        document.getElementById(`${options.className}`)
      );
      let option = {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          left: "center",
          text: "大数据量面积图"
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: options.date
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"]
        },
        // dataZoom: [
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 10
        //   },
        //   {
        //     start: 0,
        //     end: 10,
        //     handleIcon:
        //       "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //     handleSize: "80%",
        //     handleStyle: {
        //       color: "#fff",
        //       shadowBlur: 3,
        //       shadowColor: "rgba(0, 0, 0, 0.6)",
        //       shadowOffsetX: 2,
        //       shadowOffsetY: 2
        //     }
        //   }
        // ],
        series: [
          {
            name: "模拟数据",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 70, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 158, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: options.data
          }
        ]
      };
      mycharts.setOption(option);
    }
  }
}
</script>

