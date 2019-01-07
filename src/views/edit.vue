<template>
    <div class="edit">
       <!-- 音频编辑页 -->
        <DatePicker type="daterange" :options="dateRange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
        <Row :gutter="100" type="flex" justify="center">
            <Col :xs="24" :md="12" :style="{marginBottom: '10px'}">
                <infor-card
                    id-name="user_created_count"
                    :end-val="count.NTS_ASR_Engine_total"
                    iconType="android-person-add"
                    color="#2d8cf0"
                    intro-text="全文转写服务并发总数"
                ></infor-card>
            </Col>
            <Col :xs="24" :md="12" :style="{marginBottom: '10px'}">
                <infor-card
                    id-name="NTS_TTS_Engine_total_count"
                    :end-val="count.NTS_TTS_Engine_total"
                    iconType="ios-eye"
                    color="#64d572"
                    :iconSize="50"
                    intro-text="TTS服务并发总数"
                ></infor-card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10" type="flex" justify="center">
          <Col :xs="24" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        一小时内全文转写服务实时连接数
                    </p>
                    <div class="data-source-row">
                      <div id="NTS_ASR_connect_real" style="width:100%;height:500px;"></div>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        一小时内NTS服务使用总次数
                    </p>
                    <div class="data-source-row">
                      <div id="NTS_All_connect_total" style="width:100%;height:500px;"></div>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        一小时内全文转写服务使用总次数
                    </p>
                    <div class="data-source-row">
                      <div id="NTS_ASR_connect_total" style="width:100%;height:500px;"></div>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        一小时内语音合成服务使用总次数
                    </p>
                    <div class="data-source-row">
                      <div id="NTS_TTS_connect_total" style="width:100%;height:500px;"></div>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="12" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        一小时内语义理解服务使用总次数
                    </p>
                    <div class="data-source-row">
                      <div id="NTS_NLP_connect_total" style="width:100%;height:500px;"></div>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
import moment from "moment";
import chart from "./components/chart";
import inforCard from "./components/inforCard.vue";
import countUp from "./components/countUp.vue";
export default {
  data() {
    return {
      count: {
        NTS_ASR_Engine_total: 496,
        NTS_TTS_Engine_total: 3264
      },
      timeStepParams: {
        time: 3600,
        step: 14
      },
      options: {
        className: "123"
      },
      timerId: null,
      start: Math.round(moment().subtract(1, "days") / 1000), //12月24号0点
      end: Math.round(moment() / 1000), //12月26号0点
      step: 14, //prometheus查询条件中step为14时横轴对应的时间为1h
      NTS_ALL_data: [],
      dateRange: {
        shortcuts: [
          {
            text: "1 week",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "1 month",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "3 months",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      }
    };
  },
  components: {
    chart,
    inforCard,
    countUp
  },
  methods: {
    dataAjax(params) {
      console.log('new',+new Date()/1000);
      
      // let endTimestamp = 1545989450.171;
      let endTimestamp = +new Date()/1000;
      // let startTimestamp = 1545985850.171;
      let startTimestamp = endTimestamp - 3600;
      axios({
        url: `http://192.168.1.238:9090/api/v1/query_range?query=${
          params.className
        }&start=${startTimestamp}&end=${endTimestamp}&step=${this.step}`
      }).then(res => {
        // console.log("res", res.data.data.result);
        let metric = res.data.data.result.map(item => item.metric);

        // console.log('res.data.data.result.map(item => [...item,metric])',metric);

        let data = res.data.data.result
          .reduce((pre, cur) => {
            return [...pre, ...cur.values];
          }, [])
          .map(item => item[1])
          .map(item => parseFloat(item));
        // console.log("NTS_ALL_data", NTS_ALL_data);
        let date = res.data.data.result.reduce((pre, cur) => {
          return [...pre, ...cur.values];
        }, []);
        // .map(item => moment.unix(item[0]).format("HH:mm"));
        // console.log("new date", date);

        // console.log('date',date);
        

        this.initCharts({
          date,
          data,
          metric: metric[0]
        });
      });
    },
    initCharts(options) {
      console.log("options", options);

      if (!options) return;

      let mycharts = echarts.init(
        document.getElementById(`${options.metric["__name__"]}`)
      );
      let option = {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            // console.log('params',params);
            return `
            <ul>
              <li>${moment
                .unix(options.date[params[0].dataIndex][0])
                .format("YYYY-MM-DD HH:mm:ss")}</li>
              <li>${options.metric["__name__"]}: ${params[0].data}</li>
              <li>instance: ${options.metric.instance}</li>
              <li>job: ${options.metric.job}</li>
            </ul>
            `;
          },
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        // title: {
        //   left: "center",
        //   text: "大数据量面积图"
        // },
        // toolbox: {
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: "none"
        //     },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            formatter: function(value) {
              // console.log('value',value);
              
              // console.log('x轴',moment.unix(value.split(',')[0]).format("HH:mm"));
              // return value.split(',')[0];
              return moment.unix(value.split(",")[0]).format("HH:mm");
            }
          },
          data: options.date
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "10%"],
          scale: true
          // axisLabel: {
          //   formatter: function(value) {
          //     return value > 1000 ? `${value / 1000}k` : value;
          //   }
          // }
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
            // name: "模拟数据",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",

            // emphasis: {
            //   label: {
            //     show: true,
            //     formatter: function(params) {
            //       // console.log('params',params);
            //       return `${options.params.className}: ${params.data}`;
            //     }
            //   }
            // },
            itemStyle: {
              color: "rgb(255, 70, 131)",
              normal: {}
            },
            // areaStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     {
            //       offset: 0,
            //       color: "rgb(255, 158, 68)"
            //     },
            //     {
            //       offset: 1,
            //       color: "rgb(255, 70, 131)"
            //     }
            //   ])
            // },
            data: options.data
          }
        ]
      };
      mycharts.setOption(option);
    },
    dataAjax1(params) {
      // let endTimestamp = 1545989450.171;
      let endTimestamp = +new Date()/1000;
      // let startTimestamp = 1545985850.171;
      let startTimestamp = endTimestamp - 3600;
      axios({
        url: `http://192.168.1.238:9090/api/v1/query_range?query=${
          params.className
        }&start=${startTimestamp}&end=${endTimestamp}&step=${this.step}`
      }).then(res => {
        console.log("res", parseInt(res.data.data.result[0].values[0][1]));
        this.$set(
          this.count,
          `${params.className}`,
          parseInt(res.data.data.result[0].values[0][1])
        );
      });
    },
    init() {
      this.dataAjax({ className: "NTS_All_connect_total" });
      this.dataAjax({ className: "NTS_ASR_connect_total" });
      this.dataAjax({ className: "NTS_TTS_connect_total" });
      this.dataAjax({ className: "NTS_NLP_connect_total" });
      this.dataAjax({ className: "NTS_ASR_connect_real" });
      this.dataAjax1({ className: "NTS_ASR_Engine_total" });
      this.dataAjax1({ className: "NTS_TTS_Engine_total" });
    }
  },
  created() {
    this.init();
    // this.timeId = setInterval(() => this.init(), 15000);
  },
  beforeDestroy() {
    //清除定时器
    clearInterval(this.timerId);
    console.log("beforeDestroy");
  }
};
</script>

