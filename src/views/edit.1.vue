<template>
    <div class="edit">
      <h3>音频编辑页1</h3>
      <Row type="flex" justify="space-around">
        <Col>
          <input type="file" name="" id="" ref="file" multiple>
          <button @click="submit">提交</button>
        </Col>
        <Col>
          <Form ref="voiceprintDetailForm" :model="voiceprintDetailForm" :label-width="80" style="width: 300px">
          <FormItem
                v-for="(item, idx) in voiceprintDetailForm.Certificates"
                v-if="item.status"
                :key="idx"
                :label="'证件类型/号码 ' + item.index"
                :prop="'Certificates.' + idx"
                >
                <!-- :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}" -->
            <Row>
                <Col span="18">
                    <Select v-model="item.Type" style="width:90px">
		                  <Option v-for="el in certificates" :value="el.value" :key="el.value">{{ el.label }}</Option>
		                </Select>
                    <!-- <Input type="text" v-model="item.Type" placeholder="Enter something..."></Input> -->
                    <Input type="text" v-model="item.Number" placeholder="Enter something..."></Input>
                </Col>
                <Col span="4" offset="1">
                    <Button @click="handleRemove(idx)">Delete</Button>
                </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('voiceprintDetailForm')">Submit</Button>
            <Button @click="handleReset('voiceprintDetailForm')" style="margin-left: 8px">Reset</Button>
          </FormItem>
         </Form>
        </Col>
      </Row>
      <h3>自定义wavesurfer插件使用</h3>
      <Button @click="broadHandler">宽带</Button>
      <Button @click="narrowHandler">窄带</Button>
      <!-- <div v-for="item in 4" :key="item"> -->

        <div id='waveform-1'></div>
        <!-- <div :id=`waveform-${item}`></div> -->
        <div id="wave-spectrogram1"></div>

      <!-- </div> -->
      <div class="main">
          <ul class="wavelists" @dblclick="activeChecked($event)">
            <li v-for="(item,index) in fileArr" :key="index">
              <div class="fileinfo">
                <div>文件名：{{ item.fileName | pathformat() }}</div>
                <!-- <div>文件名：{{ item.fileName }}</div> -->
              </div>
              <div :id="'waveform-timeline-'+ ( index + 1 )"></div>
              <div :class="{graph: true, active:isCheckedindex === index}" style="position:relative;">
                <spin fix v-show="spinShow && isCheckedindex === index" style="background-color:rgba(255,255,255,.5);">
                    <svg viewBox="0 0 64 64" style="width: 40px; height: 40px">
                        <g stroke-width="0">
                            <circle cx="24" cy="0" transform="translate(32,32)" r="7.48463">
                                <animate attributeName="r" dur="750ms" values="8;7;6;5;4;3;2;1;8" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="16.970562748477143" cy="16.97056274847714" transform="translate(32,32)" r="4.60759">
                                <animate attributeName="r" dur="750ms" values="1;8;7;6;5;4;3;2;1" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="1.4695761589768238e-15" cy="24" transform="translate(32,32)" r="1.48463">
                                <animate attributeName="r" dur="750ms" values="2;1;8;7;6;5;4;3;2" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="-16.97056274847714" cy="16.970562748477143" transform="translate(32,32)" r="2.48463">
                                <animate attributeName="r" dur="750ms" values="3;2;1;8;7;6;5;4;3" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="-24" cy="2.9391523179536475e-15" transform="translate(32,32)" r="3.48463">
                                <animate attributeName="r" dur="750ms" values="4;3;2;1;8;7;6;5;4" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="-16.970562748477143" cy="-16.97056274847714" transform="translate(32,32)" r="4.48463">
                                <animate attributeName="r" dur="750ms" values="5;4;3;2;1;8;7;6;5" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="-4.408728476930472e-15" cy="-24" transform="translate(32,32)" r="5.48463">
                                <animate attributeName="r" dur="750ms" values="6;5;4;3;2;1;8;7;6" repeatCount="indefinite"></animate>
                            </circle>
                            <circle cx="16.970562748477136" cy="-16.970562748477143" transform="translate(32,32)" r="6.48463">
                                <animate attributeName="r" dur="750ms" values="7;6;5;4;3;2;1;8;7" repeatCount="indefinite"></animate>
                            </circle>
                        </g>
                    </svg>
                  </spin>
                <div class="musk" v-show="isShowmusk" style="height:256px;">
                  <div>
                     <!-- style="width:100px;height:10px;" -->
                    <Progress :percent="percent" v-show="isShowCircle" :stroke-width="10" style="width:50%;position:absolute;top:50%;left:25%;"></Progress>
                  </div>
                </div>
                <div :id="'waveform-' + ( index + 1 )" class="waveform">
                  
                </div>
                <div :id="'wave-spectrogram' + ( index + 1 )" class="hidden"></div>
                
              </div>
            </li>
          </ul>
        </div>
    </div>
</template>
<script>
import { province } from "./address/province.js";
import { city } from "./address/city.js";
import { area } from "./address/area.js";
import WaveSurfer from "../libs/wavesurfer/src/wavesurfer.js";
import SpectrogramPlugin from "../libs/wavesurfer/src/plugin/spectrogram.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
import axios from "axios";
import { options } from 'countup';

// import WaveSurfer from "wavesurfer.js";
// import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";
export default {
  data() {
    return {
      options : {
        container: '#waveform-1',
        waveColor: 'violet',
        progressColor: 'purple',
        loaderColor: 'purple',
        cursorColor: 'navy',
        plugins: [
              SpectrogramPlugin.create({
                    container: `#wave-spectrogram1`,
                    labels: true,
                })
            ]
    },
    wavesurfer:'',
      flag: false,
      fileArr: [],
      certificates: [
        {
          label: "身份证",
          value: 1
        },
        {
          label: "学生证",
          value: 2
        }
      ],
      certificateNo: 1,
      voiceprintDetailForm: {
        Certificates: [
          {
            Type: "",
            Number: "",
            index: 1,
            status: 1
          }
        ]
      }
    };
  },
  methods: {
    narrowHandler() {
      this.flag = false;
      if ( this.wavesurfer ) {
        this.wavesurfer.destroyPlugin('spectrogram');
      }
      const wavesurfer = this.createWavesurferInstance(1);
      wavesurfer.load('http://192.168.1.53:9000/localvoice/20181226143404/声纹_白岩松.wav');
      this.wavesurfer = wavesurfer;
    },
    broadHandler() {
      this.flag = true;
      if ( this.wavesurfer ) {
        this.wavesurfer.destroyPlugin('spectrogram');
      }
      const options = {
        id: 1,
        flag: false
      };
      const wavesurfer = this.createWavesurferInstance(1);
      wavesurfer.load('http://192.168.1.53:9000/localvoice/20181226143404/声纹_白岩松.wav');
      this.wavesurfer = wavesurfer;
    },
    createWavesurferInstance(id) {
      // console.log("container:", `#waveform-${id}`);
      return WaveSurfer.create({
        container: `#waveform-${id}`,
        cursorColor: "#c93232",
        audioRate: 1,
        scrollParent: false,
        backend: "WebAudio",
        barHeight: 1.5,
        /* 波形未播放时颜色 */
        waveColor: "#43d996",
        /* 波形已播放的颜色 */
        progressColor: "#29825c",
        loaderColor: "red",
        height: 256,
        // hideScrollbar: true,
        interact: false,
        plugins: [
          // TimelinePlugin.create({
          //   container: `#waveform-timeline-${id}`,
          //   fontSize: 14,
          //   cprimaryFontColor: "#9191a5",
          //   secondaryFontColor: "#9191a5", //时间轴数字颜色
          //   primaryColor: "#9191a5",
          //   secondaryColor: "#9191a5"
          // }),
          RegionsPlugin.create({
            id: `#${id}`,
            color: "red",
            color: "rgba(255, 0, 255, .9)",
            opacity: 1
          }),
          SpectrogramPlugin.create({
            container: `#wave-spectrogram${id}`,
            labels: true,
            flag: this.flag,
          })
        ]
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(
            "this.voiceprintDetailForm.Certificates",
            this.voiceprintDetailForm.Certificates
          );

          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleAdd() {
      this.certificateNo++;
      this.voiceprintDetailForm.Certificates.push({
        Type: "",
        index: this.certificateNo,
        status: 1
      });
    },
    handleRemove(index) {
      this.voiceprintDetailForm.Certificates[index].status = 0;
    },
    submit() {
      console.log("this.$refs.file", this.$refs.file.files[0]);
      this.$refs.file.value = "";
    }
  },
  created() {
    
    //处理多级联动地址选择器(方法3:省市区数据全部使用reduce处理)
    // console.log("area", area);
    let cityData = [];
    for (const key in city) {
      cityData.push({
        value: key,
        label: city[key][0]["province"],
        children: city[key].reduce((pre, cur) => {
          pre.push({
            value: cur.id,
            label: cur.name
          });
          return pre;
        }, [])
      });
    }
    let areaData = [];
    for (const key in area) {
      areaData.push({
        value: key,
        label: area[key][0] ? area[key][0]["city"] : "",
        children: area[key].reduce((pre, cur) => {
          pre.push({
            value: cur.id,
            label: cur.name
          });
          return pre;
        }, [])
      });
    }
    // console.log('cityData',cityData);
    // console.log('areaData',areaData);

    let data = cityData.reduce((pre, cur) => {
      pre.push({
        value: cur.value,
        label: cur.label,
        children: areaData.filter(
          item => item.value.slice(0, 2) === cur.value.slice(0, 2)
        )
      });
      return pre;
    }, []);

    // console.log("data", data);

    return;
    //处理多级联动地址选择器(方法2:省市区数据使用reduce处理，再用map)
    // let provinceData = province.reduce((pre, cur) => {
    //   pre.push({
    //     value: cur.id,
    //     label: cur.name
    //   });
    //   return pre;
    // }, []);
    // console.log("provinceData", provinceData);
    // let cityData = [];
    // for (const key in city) {
    //   cityData.push({
    //     value: key,
    //     children: city[key].reduce((pre, cur) => {
    //       pre.push({
    //         value: cur.id,
    //         label: cur.name
    //       });
    //       return pre;
    //     }, [])
    //   });
    // }
    // console.log("cityData", cityData);
    // let areaData = [];
    // for (const key in area) {
    //   areaData.push({
    //     value: key,
    //     children: area[key].reduce((pre, cur) => {
    //       pre.push({
    //         value: cur.id,
    //         label: cur.name
    //       });
    //       return pre;
    //     }, [])
    //   });
    // }
    // console.log("areaData", areaData);
    // let data = provinceData
    //   .map(item => {
    //     return Object.assign({}, item, {
    //       children: cityData.find(el => el.value === item.value)
    //         ? cityData.find(el => el.value === item.value).children
    //         : []
    //     });
    //   })
    //   .map(item => {
    //     return Object.assign({}, item, {
    //       children: item.children.map(el => {
    //         return Object.assign({}, el, {
    //           children: areaData.find(e => el.value === e.value)
    //             ? areaData.find(e => el.value === e.value).children
    //             : []
    //         });
    //       })
    //     });
    //   });
    // console.log("data", data);

    return;
    //处理多级联动地址选择器(方法1)
    for (var key in city) {
      city[key].map(item => {
        for (var k in area) {
          if (item.id === k) {
            return Object.assign(item, {
              children: area[k]
            });
          }
        }
      });
    }
    console.log("city", city);
  },
  mounted() {
    // const instance = this.createWavesurferInstance(1);
    // instance.load('http://192.168.1.53:9000/localvoice/20181226143404/声纹_白岩松.wav');
  }
};
</script>
<style lang="less" scoped>
.main {
  flex: 1;
  overflow: auto;
  background-color: #202336;
  // background-color: #000;
  height: calc(100% - 82px - 76px);
  width: 100%;
  position: relative;
  .wavelists {
    width: 100%;
    height: 100%;
    > li {
      // height: 100%;

      .fileinfo {
        width: 100%;
        height: 25px;
        line-height: 25px;
        color: #fcfaf2;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        .showSpec {
          opacity: 0;
          &:hover {
            opacity: 1;
          }
        }
      }
      .graph {
        //position: relative;
        width: 100%;
        // height: 256px;
        // height: 628px;
        border: 1px solid #6c6c6c;
        &.active {
          border: 1px solid #ffd86f;
        }
        .musk {
          position: absolute;
          width: 100%;
          // height: 100%;
          z-index: 2;
          // background-color: @theme_color;
          opacity: 0.9;
        }
      }
    }
  }
}
</style>


