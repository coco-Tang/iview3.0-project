<template>
    <div class="index">
        <Row>
          <Col span="8">
              <h3>可展开的表格</h3>
              <Table 
                  :columns="columns" :data="tableData"
              ></Table>
          </Col>
        </Row>
        
        <Row type="flex" justify="center">
          <Col span="4">
            <Button @click="modal1=true;">按钮11</Button>
            <Button @click="modal2=true;">按钮22</Button>
            <Button @click="modal3=true;">按钮33</Button>
          </Col>
           
            <Col span="4">
                <Button v-for="(item,index) in btnArr" :key="index" @click="showModal(item.b)">{{item.a}}</Button>
            </Col>
            <Col span="16">
              <Button @click="modal4=true;">打开图表</Button>
            </Col>
        </Row>
        <Row>
          <Col span="8">
          图表1
            <visite-volume></visite-volume>
          </Col>
          <Col span="8">
          图表2
          <!-- <div style="height:800px;">
            <div style="width:100%;height:100%;" id="spectrogram"></div>
          </div> -->
          </Col>
          <Col span="8">
          图表3
            <!-- <div id="echarts"></div> -->
            <div style="width:100%;height:100%;" id="visite_volume_con2"></div>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <div class="nav-button-box">
               <span class="nav-button-fix">
                 <div class="nav-button" v-for="(item,index) in buttonArr" :key="index" :class="{active : activeBtn == index}" @click="goAnchor('#anchor-'+index,index)">{{item}}</div>
               </span>
             </div>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <h3>单个弹框</h3>
            <Button type="primary" @click="value = !value">打开弹框</Button>
            <child-modal v-model="value" @on-complete="complete"></child-modal>
          </Col>
          <Col span="8">
            <h3>多个弹框</h3>
            <Button type="primary" @click="value1 = !value1">打开弹框1</Button>
            <one-modal v-model="value1" @on-complete="complete1"></one-modal>

            <Button type="primary" @click="value2 = !value2">打开弹框2</Button>
            <two-modal v-model="value2" @on-complete="complete1"></two-modal>
 
          </Col>
          <Col span="8">
            <h3>表单模块</h3>
            <Button type="success" @click="toggleFormInfo">按钮</Button>
            <Button @click="editFormInfo">编辑</Button>
            <baseForm :form="formInfo" :show="showEdit" @saveFormInfo="saveFormInfo"></baseForm>

          </Col>
        </Row>
        <Row>
          <Col span="8">
            <h3>表单验证</h3>
            <Form
              ref="projectDetailForm" 
              label-position="right" 
              :label-width="100"
              :model="projectDetailForm" 
              :rules="projectDetailRules">

              <FormItem label="建立日期:" prop="createtime">
                <DatePicker type="date" placeholder="请选择项目建立日期" v-model="projectDetailForm.createtime" style="width:100%;"></DatePicker>
              </FormItem>

              <FormItem label="完成日期:" prop="completiontime">
                <DatePicker type="date" placeholder="请选择项目完成日期" v-model="projectDetailForm.completiontime" style="width:100%;"></DatePicker>
              </FormItem>

              <FormItem label="委托日期:" prop="entrusttime">
                <DatePicker type="date" placeholder="请选择委托日期" v-model="projectDetailForm.entrusttime" style="width:100%;"></DatePicker>
              </FormItem>
            </Form>

          </Col>
          <Col span="8">
            <h3>
              Promise(async/await)
            </h3>
            <Button @click="getPromiseResult">getPromiseResult</Button>
            <Button @click="getPromiseResultA">getResultA</Button>
            <Button @click="getPromiseResultB">getResultB</Button>

          </Col>
        </Row>
        <Row>
          <Col>
            <h3>锚点</h3>
            <div id="anchor-0" class="anchor">anchor123</div>
            <div id="anchor-1" class="anchor">anchor456</div>
            <div id="anchor-2" class="anchor">anchor789</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button>播放</Button>
            <Button>暂停</Button>
            <Button>频谱</Button>
            <Button>倒谱</Button>
            <div v-for="(item,index) in fileArr" :key="index" :id="'waveform-' + (index)"></div>
          </Col> 
        </Row>
        
        <BaseModal :value="modal_show" :title="modal_title"></BaseModal>
        <Modal v-model="modal1" :draggable="true" :footer-hide="true" title="title1" @on-visible-change="openSpectrogram">
            <div class="main-content">
              main-content
              <div style="width:100%;height:100%;" id="spectrogram"></div>
            </div>
        </Modal>
        <Modal v-model="modal2" :draggable="true" :footer-hide="true" title="title2" @on-visible-change="openLine">
            <div class="main-content1">
              main-content1
              <div style="width:100%;height:100%;" id="line"></div>
            </div>
        </Modal>
        <Modal v-model="modal3" :draggable="true" :footer-hide="true" title="title3">
            <div class="main-content2">
              main-content2
            </div>
        </Modal>
        <Modal v-model="modal4" :draggable="true" :footer-hide="true" title="title4" @on-visible-change="openSpectrogram">
            打开图表的对话框
            <div style="width:100%;height:100%;" id="visite_volume_con"></div>
            <div style="width:100%;height:100%;" id="visite_volume_con2"></div>
            <!-- <visite-volume></visite-volume> -->
        </Modal>
    </div>
</template>
<script>
import echarts from "echarts";
import BaseModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import ChildModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import oneModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import twoModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import visiteVolume from "../components/visiteVolume";
import baseForm from "../components/BaseForm";
import moment from "moment";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import Expand from './expand';
export default {
  components: {
    Expand,
    BaseModal,
    visiteVolume,
    ChildModal,
    oneModal,
    twoModal,
    baseForm
  },
  data() {
    const createtimeValidate = (rule,value,callback) => {
      if (value === '') {
          callback(new Error('请选择一个日期'));
      } else {
        if (this.projectDetailForm.completiontime !== "") {
          // console.log(1)
          this.$refs.projectDetailForm.validateField('completiontime');
          // callback(new Error('项目完成时间不得在项目建立时间之前'));
        } 
        // console.log('this.projectDetailForm.createtime',moment(this.projectDetailForm.createtime).valueOf())
        // console.log('createtimeValidate',moment(value).valueOf());
        // console.log(2)
          callback();
      }
    }
    const entrusttimeValidate = (rule,value,callback) => {
      if (value === '') {
          callback(new Error('请选择一个日期'));
      } else if (moment(value).valueOf() >= moment(this.projectDetailForm.createtime).valueOf()) {
        if (moment(value).valueOf() > moment(this.projectDetailForm.completiontime).valueOf()) {
          callback(new Error('委托日期不得在项目完成日期之后'));
        } else {
          callback();

        }
      } else {
        // console.log('completiontimeValidate',moment(this.projectDetailForm.createtime).valueOf());
        // console.log('completiontimeValidate',moment(value).valueOf());
        callback(new Error('项目完成时间不得在项目建立时间之前'));
        // console.log(3)


      }
    }
    const completiontimeValidate = (rule,value,callback) => {
      if (value === '') {
          callback(new Error('请选择一个日期'));
      } else if (moment(value).valueOf() >= moment(this.projectDetailForm.createtime).valueOf()) {
        callback();
      } else {
        // console.log('completiontimeValidate',moment(this.projectDetailForm.createtime).valueOf());
        // console.log('completiontimeValidate',moment(value).valueOf());
        callback(new Error('项目完成时间不得在项目建立时间之前'));
        // console.log(3)


      }
    }
    return {
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
              return h(Expand, {
                  props: {
                      row: params.row
                  }
              })
          }
        },
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Age',
            key: 'age'
        },
        {
            title: 'Address',
            key: 'address'
        }
      ],
      tableData: [
        {
          name: "cc",
          age: 18, 
          address: "长宁区",
          list: ['ll']
        },
        {
          name: "dd",
          age: 66, 
          address: "普陀区",
          list: ['tt']
        },
        {
          name: "aa",
          age: 3, 
          address: "闵行区",
          list: ['jj']
        },
      ],
      fileArr: [],
      projectDetailForm: {
        id: "",
        name: "",
        operator: "",
        createtime: "",
        type: "",
        client: "",
        entrusttime: "",
        entrustplace: "",
        remark: "",
        commitments: "",
        material: "",
        completiontime: ""
      },
      projectDetailRules: {
        
        createtime: [
          {
            required: true,
            type: "date",
            validator: createtimeValidate,
            trigger: "blur"
          }
        ],
        entrusttime: [
          {
            required: true,
            type: "date",
            validator: entrusttimeValidate,
            trigger: "blur"
          }
        ],
        completiontime: [
          {
            required: true,
            type: "date",
            validator: completiontimeValidate,
            trigger: "blur"
          }
        ],
      },
      buttonArr: ["整体分析", "错题整理", "提分训练"],
      activeBtn: 0,
      btnArr: [
        { a: "按钮1", b: 1 },
        { a: "按钮2", b: 2 },
        { a: "按钮3", b: 3 }
      ],
      modal_show: false,
      modal_title: "",
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      value:  false,
      value1:  false,
      value2:  false,
      formInfo: {},
      showEdit: false,
      arr: [
        { id: 0, name: 'cc', age: 18, gender: 'male', hobby: 'basketball' }, 
        { id: 1, name: 'aa', age: 6, gender: 'female', hobby: 'piano' }, 
        { id: 2, name: 'tt', age: 55, gender: 'female', hobby: 'fly kites' }, 
        { id: 3, name: 'dd', age: 48, gender: 'male', hobby: 'footerball' }, 
      ],
      spectrogramChart: "",
      chartData: [],
      showSpectrogramFlag: false,
    };
  },
  methods: {
    createWavesurferInstance(id) {
      return WaveSurfer.create({
                container: `#waveform-${id}`,
                waveColor: 'violet',
                progressColor: 'purple'
            })
    },
    getA() {
      return new Promise(resolve => {
        axios({url:"http://localhost:10001/api/promiseA"}).then(res => {
          resolve(res.data)
        })
      })
    },
    getB() {
      axios({url:"http://localhost:10001/api/promiseB"})
    },
    result(id) {
      return new Promise(resolve => {
        axios({url:`http://localhost:10001/api/promise/${id}`}).then(res => {
          console.log('res.data.data',res.data.data)
          resolve(res.data.data)
        })
      })

    },
    async getPromiseResult() {
      let docs = [1,2,3];
      let promises = docs.map((doc) => this.result(doc));
      let results = await Promise.all(promises);

      // let result = this.result();
      console.log('results',results);
    },
    async getPromiseResultA() {
      let a = await this.getA();
      console.log('a',a);
      // let result = this.getA();
      // console.log('result',result);
    },
    getPromiseResultB() {
      let result = this.getB();
      console.log('result',result);
    },
    toggleFormInfo() {
      let arr = this.arr;
      this.formInfo = arr[parseInt(Math.random()*4)];
    },
    editFormInfo() {
      this.showEdit = true;

    },
    saveFormInfo(data) {
      console.log('接收子组件的数据',data);
      this.showEdit = false;
      let arr = this.arr;
      arr.forEach(el => {
        if (el.id === data.id) {
          el = data.formData;
          return;
        }
      })
    },
    //锚点跳转
    goAnchor(selector, index) {
      let d = new Date();
      console.log('d',d.getTime());
      return
      this.activeBtn = index;
      // this.$el.querySelector(selector).scrollIntoView();//当区块高度过大时，可实现锚点的效果
      // document.querySelector("#app-root").scrollTop = this.$el.querySelector(selector).offsetTop;//不生效
      document.documentElement.scrollTop = this.$el.querySelector(selector).offsetTop;//当区块高度过大时，可实现锚点的效果
      // console.log('this.$el.querySelector(selector).offsetTop',this.$el.querySelector(selector).offsetTop)
      // console.log('document.querySelector("#app-root")',document.querySelector("#app-root"))
    },
    showModal(id) {
        console.log('modalid',id)
      switch (id) {
        case 1:
          this.modal_show = true;
          this.modal_title = "1";
          let data = [Math.random() * 300];
          for (var i = 1; i < 20000; i++) {
            data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
          }
          this.chartData = data;
          break;
        case 2:
          this.modal_show = true;
          this.modal_title = "2";
          break;
        case 3:
          this.modal_show = true;
          this.modal_title = "3";
          break;
      }
      //   this.modal_show = true;
    },
    initSpectrogram(chartData=[]) {
      let mycharts = echarts.init(document.getElementById("spectrogram"));
      this.spectrogramChart = mycharts;
      var base = +new Date(1968, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var date = [];

      var data = [Math.random() * 300];

      for (var i = 1; i < 20000; i++) {
        var now = new Date((base += oneDay));
        date.push(
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/")
        );
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
      }

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
          data: date
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"]
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: [
          {
            name: "模拟数据",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              normal: {
                color: "rgb(255, 70, 131)"
              }
            },
            areaStyle: {
              normal: {
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
              }
            },
            data: data
            // data: chartData
          }
        ]
      };
      mycharts.setOption(option);
      window.addEventListener('resize', function () {
          mycharts.resize();
      });
    },
    initLine() {
      let mycharts = echarts.init(document.getElementById("line"));
      let option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
      };
      mycharts.setOption(option);
      window.addEventListener('resize', function () {
          mycharts.resize();
      });

    },
    // initChart() {
    //   let mycharts = echarts.init(document.getElementById("echarts"));
    //   let option = {
    //     xAxis: {
    //       type: "category",
    //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    //     },
    //     yAxis: {
    //       type: "value"
    //     },
    //     series: [
    //       {
    //         data: [820, 932, 901, 934, 1290, 1330, 1320],
    //         type: "line"
    //       }
    //     ]
    //   };
    //   mycharts.setOption(option);
    //   // console.log(mycharts);
    // },
    openSpectrogram(flag) {
      // console.log('flag隐藏',flag);
      // return;
      if (flag) {
      // console.log('flag显示',flag);
      // this.showSpectrogramFlag = flag;
        // this.spectrogramChart.resize();
        this.$nextTick(() => {
          this.initSpectrogram();
          // this.initSpectrogram(this.chartData);
        });
        // console.log("zxl");
        // this.initChart();
      } else {
        this.spectrogramChart.resize();
      }
    },
    openLine(flag) {
      if (flag) {
        this.$nextTick(() => {
          this.initLine();
          // this.initSpectrogram(this.chartData);
        });
      }
    },
    initChart() {
      this.$nextTick(() => {
        let visiteVolume = echarts.init(
          document.getElementById("visite_volume_con2")
        );
        let xAxisData = [];
        let data1 = [];
        let data2 = [];
        for (let i = 0; i < 20; i++) {
          xAxisData.push("类目" + i);
          data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
          data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        }

        const option = {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          grid: {
            top: 0,
            left: "2%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: "category",
            data: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
            nameTextStyle: {
              color: "#c3c3c3"
            }
          },
          series: [
            {
              name: "访问量",
              type: "bar",
              data: [
                {
                  value: 453682,
                  name: "Mon",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 879545,
                  name: "Tues",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 2354678,
                  name: "Wed",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 1598403,
                  name: "Thur",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 543250,
                  name: "Fri",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 1305923,
                  name: "Sat",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                },
                {
                  value: 1103456,
                  name: "Sun",
                  itemStyle: { normal: { color: "#2d8cf0" } }
                }
              ]
            }
          ]
        };

        visiteVolume.setOption(option);

        window.addEventListener("resize", function() {
          visiteVolume.resize();
        });
      });
    },
    complete(boo) {
      this.value = boo;
    },
    complete1(boo,obj) {
      this[obj] = boo;
    }
  },
  mounted() {
    let fileArr = [
      {
        id: 0,
        url: "./audio/G.E.M.邓紫棋 - 光年之外.flac"
      },
      {
        id: 1,
        url: "./audio/何小萍-G-1.wav"
      },
      {
        id: 2,
        url: "./audio/陈硕琦-G-1.wav"
      },
      {
        id: 3,
        url: "./audio/顾敏-G-1.wav"
      }
    ]
    this.fileArr = fileArr;
    let instanceArr = [];
    fileArr.forEach(el => {
      this.$nextTick(() => {
        instanceArr.push({ instance: this.createWavesurferInstance(el.id), url: el.url })
      })
    });
    instanceArr.forEach(el => {
      this.$nextTick(() => {
        el.instance.load(el.url)
      })
    });

    // let instanceArr = fileArr.map(el => {
    //   // return this.createWavesurferInstance(el.id)
    //   this.$nextTick(() => {
    //     // instanceArr.push(this.createWavesurferInstance(el.id));
    //     return this.createWavesurferInstance(el.id);
    //   })
    // })
    // console.log('instanceArr',instanceArr);
    // instanceArr[0].load("./audio/G.E.M.邓紫棋 - 光年之外.flac")
    // instanceArr.forEach(el => el.load(el.url));
    // this.$nextTick(()=>{
    //   // this.initSpectrogram(this.chartData);
    //   this.initSpectrogram();
    // })
    // this.$nextTick(() => {
    //         let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
    //         let xAxisData = [];
    //         let data1 = [];
    //         let data2 = [];
    //         for (let i = 0; i < 20; i++) {
    //             xAxisData.push('类目' + i);
    //             data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
    //             data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    //         }

    //         const option = {
    //             tooltip: {
    //                 trigger: 'axis',
    //                 axisPointer: {
    //                     type: 'shadow'
    //                 }
    //             },
    //             grid: {
    //                 top: 0,
    //                 left: '2%',
    //                 right: '4%',
    //                 bottom: '3%',
    //                 containLabel: true
    //             },
    //             xAxis: {
    //                 type: 'value',
    //                 boundaryGap: [0, 0.01]
    //             },
    //             yAxis: {
    //                 type: 'category',
    //                 data: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
    //                 nameTextStyle: {
    //                     color: '#c3c3c3'
    //                 }
    //             },
    //             series: [
    //                 {
    //                     name: '访问量',
    //                     type: 'bar',
    //                     data: [
    //                         {value: 453682, name: 'Mon', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 879545, name: 'Tues', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 2354678, name: 'Wed', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 1598403, name: 'Thur', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 543250, name: 'Fri', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 1305923, name: 'Sat', itemStyle: {normal: {color: '#2d8cf0'}}},
    //                         {value: 1103456, name: 'Sun', itemStyle: {normal: {color: '#2d8cf0'}}}
    //                     ]
    //                 }
    //             ]
    //         };

    //         visiteVolume.setOption(option);

    //         window.addEventListener('resize', function () {
    //             visiteVolume.resize();
    //         });
    // });
  },
  watch: {
    chartData: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          // this.initSpectrogram(this.chartData);
          this.initSpectrogram();
        })
      }
    },
    showSpectrogramFlag: {
      handler(newVal,oldVal) {
        console.log(newVal,oldVal);
        this.spectrogramChart.resize();
      }
    }
  }
};
</script>
<style scoped lang="less">
.main-content {
  width: 100%;
  height: 800px;
  // background-color: cyan;
}
.main-content1 {
  width: 100%;
  height: 800px;
  background-color: palegoldenrod;
}
.main-content2 {
  width: 100%;
  height: 800px;
  background-color: darkgoldenrod;
}
.anchor {
  width: 100%;
  height: 400px;
}
#anchor-0 {
  // background-color: yellowgreen;
}
#anchor-1 {
  // background-color: palegreen;
}
#anchor-2 {
  // background-color: palevioletred;
}
.index {
  width: 100%;
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  text-align: center;
  h1 {
    height: 150px;
    img {
      height: 100%;
    }
  }
  h2 {
    color: #666;
    margin-bottom: 200px;
    p {
      margin: 0 0 50px;
    }
  }
  .ivu-row-flex {
    // height: 100%;
  }
}
</style>