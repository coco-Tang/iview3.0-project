<template>
    <div class="index">
      <Button @click="openModal('删除静音')">删除静音</Button>
      <Button @click="openModal('幅度缩放')">幅度缩放</Button>
      <Button @click="openModal('元音定位')">元音定位</Button>
      <audio :src="url" controls="controls" v-show="play"></audio>
        <Row type="flex" justify="space-around">
          <Col>
              <h3>多选框的使用</h3>
              <div class="class_info" v-for="(item, index) in class_info" :key="item.classid">
              <!-- 班级名称 -->
              <Checkbox :indeterminate="isIndeterminate[index]" :value="item.checked" @click.native="clasa_checked(index)">{{item.classname}}</Checkbox>

              <div style="margin-top: 5px;" @click="appoint_stu(index, item.classid)">
                <Button type="text">指定学生</Button>
                <Icon v-if="show_stu[index]" type="ios-arrow-down" />
                <Icon v-else type="ios-arrow-up" />
              </div>
              <!--   -->
              <CheckboxGroup v-if="show_stu[index]" v-model="item.checked_students" @on-change="student_checked(item.checked_students,index)">
                <Checkbox v-for="item1 in item.students" :label="item1.id" :key="item1.id" :title="item1.name" class="text_overflow">{{item1.name
                  }}</Checkbox>
              </CheckboxGroup>
            </div>
            <Button @click="publish">发布</Button>
          </Col>
          <Col>
            <span @click="pdfHandler">pdfHandler</span>
          </Col>
          <Col>
            <router-link to="/detail">跳转到详情页</router-link>
          </Col>
          <Col>
          <div v-for="(item,index) in checkGroup" :key="index">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">{{item.objectId}}</Checkbox>
            </div>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <Checkbox v-for="(item1,idx) in item.files" :label="item1" :key="idx"></Checkbox>
            </CheckboxGroup>
          </div>
          
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll"></Checkbox>
            </div>
            <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
              <div v-for="(item,index) in checkGroup" :key="index">
                <!-- {{item.objectId}} -->
                <Checkbox v-for="(item,idx) in checkAllGroup" :label="item" :key="idx"></Checkbox>
              </div>
            </CheckboxGroup>
            
          </Col>
        </Row>
        <Row>
            <Col>
                <h1>可展开的表格(1)</h1>
                <Table 
                  height="400"
                  :columns="columns" :data="scrollTableData"
                  @on-expand="enableExpand"
                  @on-selection-change="voiceChangeHandler"
                ></Table>

            </Col>
            <Col>
                <Table border ref="selection"
                    :stripe="true" 
                    :columns="columns6"
                    width="97%"
                    height="400"
                    :data="data6">
                    </Table>
                </Col>
        </Row>
        <Row>
          <Col span="8">
              <h3>可展开的表格</h3>
              <Table 
                  :columns="voiceChangeColumns" :data="tableData"
                  @on-selection-change="voiceChangeHandler"
              ></Table>
          </Col>
        </Row>
        
        <Row type="flex" justify="center">
          <Col span="4">
            <h3>展示多个弹框内容，不需要提交</h3>
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
            <Button @click="transferProject">transferProject</Button>
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
          <Col style="height: 800px;">
            vue组件
            <!-- <tui-image-editor :include-ui="useDefaultUI" :options="options"></tui-image-editor> -->
            <span @click="editHandler">编辑图片</span>
            <Button>播放</Button>
            <Button>暂停</Button>
            <Button>频谱</Button>
            <Button>倒谱</Button>
            <div v-for="(item,index) in fileArr" :key="index" :id="'waveform-' + (index)"></div>
          </Col> 
        </Row>

        <div class="demo-upload-list" style="margin-top: 100px;" v-for="item in uploadList" :key="item">
        <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <div>
      <Table :columns="uploadListInfo" :data="uploadList"></Table>
    </div>
    <Upload
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['wav','mp3']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="camera" size="20"></Icon>
        </div>
    </Upload>
    <Modal title="查看图片" v-model="visible">
        ![]('https://o5wwk8baw.qnssl.com/' + imgName + '/large')
    </Modal>
        <!-- 单个对话框切换显示图谱 -->
        <Modal v-model="toggleModal" :draggable="true" :footer-hide="true" 
            :title="toggleModaltitle" @on-visible-change="openSpectrogram">
            <div class="main-content">
              main-content
              <div style="width:100%;height:100%;" id="spectrogram"></div>
            </div>
        </Modal>
        
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

        <modal-block
            :isShow="isShow"
            :title="voiceHandlerTitle"
            :width="800"
            @submit="submit"
            @cancel="cancel">
            <div slot="content">
              <div v-if="voiceHandlerTitle === '幅度缩放'">
                <Row :gutter="16">
		              <Col span="12">
		                <div style="display:flex;">
		                  <h3>幅度缩放增益</h3>
		                </div>
		              </Col>
		            </Row>
		            <Row :gutter="16">
		              <Col span="12">
		                <div style="display:flex;">
		                  <Slider v-model="decibel" show-input input-size="small" :min="-50" :max="50" style="width:100%;"></Slider>
		                </div>
		              </Col>
		            </Row>

              </div>

              <div v-else-if="voiceHandlerTitle === '删除静音'">
                <Row :gutter="16">
		            <Col span="12">
		              <div style="display:flex;">
		                <h3>允许保留的最长静音&nbsp;&nbsp;</h3>
		                <Input v-model="framelength" style="width:50px;" size="small" :number="true" :maxlength='9999999'></Input>
		                <h3>&nbsp;毫秒</h3>
		              </div>
		            </Col>
		            <Col span="12">
		              <div style="display:flex;">
		                <h3>静音阈值&nbsp;&nbsp;</h3>
		                <Select v-model="model2" style="width:90px" size="small">
		                  <Option v-for="(item,index) in frameshift" :value="item" :key="index">{{ item }}</Option>
		                </Select>
		              </div>
		            </Col>
		            </Row>

              </div>

              <div v-else="voiceHandlerTitle === '元音定位'">
                <Input v-model="hotValue" placeholder="请输入关键词"/>
              </div>
              
              
            </div>
        </modal-block>
    </div>
</template>
<script>
import echarts from "echarts";
import BaseModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import ChildModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import oneModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
import twoModal from "../components/BaseModal.vue"; //iview project不支持@别名的写法,@只在vue-cli中有效
// import VoiceHandlerModal from "../components/VoiceHandlerModal";
import visiteVolume from "../components/visiteVolume";
import baseForm from "../components/BaseForm";
import moment from "moment";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";
import Expand from "./expand";
import ModalBlock from "../components/ModalBlock";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
import pdfMake from "../libs/pdfmake.js";
import pdfFonts from "../libs/vfs_fonts.js";
import { ImageEditor } from "@toast-ui/vue-image-editor";
export default {
  components: {
    // "tui-image-editor": ImageEditor,
    Expand,
    BaseModal,
    visiteVolume,
    ChildModal,
    oneModal,
    twoModal,
    baseForm,
    ModalBlock
  },
  data() {
    const createtimeValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择一个日期"));
      } else {
        if (this.projectDetailForm.completiontime !== "") {
          // console.log(1)
          this.$refs.projectDetailForm.validateField("completiontime");
          // callback(new Error('项目完成时间不得在项目建立时间之前'));
        }
        // console.log('this.projectDetailForm.createtime',moment(this.projectDetailForm.createtime).valueOf())
        // console.log('createtimeValidate',moment(value).valueOf());
        // console.log(2)
        callback();
      }
    };
    const entrusttimeValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择一个日期"));
      } else if (
        moment(value).valueOf() >=
        moment(this.projectDetailForm.createtime).valueOf()
      ) {
        if (
          moment(value).valueOf() >
          moment(this.projectDetailForm.completiontime).valueOf()
        ) {
          callback(new Error("委托日期不得在项目完成日期之后"));
        } else {
          callback();
        }
      } else {
        // console.log('completiontimeValidate',moment(this.projectDetailForm.createtime).valueOf());
        // console.log('completiontimeValidate',moment(value).valueOf());
        callback(new Error("项目完成时间不得在项目建立时间之前"));
        // console.log(3)
      }
    };
    const completiontimeValidate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择一个日期"));
      } else if (
        moment(value).valueOf() >=
        moment(this.projectDetailForm.createtime).valueOf()
      ) {
        callback();
      } else {
        // console.log('completiontimeValidate',moment(this.projectDetailForm.createtime).valueOf());
        // console.log('completiontimeValidate',moment(value).valueOf());
        callback(new Error("项目完成时间不得在项目建立时间之前"));
        // console.log(3)
      }
    };
    return {
      uploadListInfo: [
        {
          type: "index",
          width: 60,
          title: "序号"
        },
        {
          title: "文件名",
          key: "fileName"
        },
        {
          title: "上传进度",
          key: "progress",
          render: (h, params) => {
            return h("div", h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              ));
          }
        },
        {
          title: "操作",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                "Delete"
              )
            ]);
          }
        }
      ],
      defaultList: [
        {
          name: "a42bdcc1178e62b4694c830f028db5c0",
          url:
            "https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar"
        },
        {
          name: "bc7521e033abdd1e92222d733590f104",
          url:
            "https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar"
        }
      ],
      imgName: "",
      visible: false,
      uploadList: [],
      hotValue: "",
      model2: "-40dB",
      decibel: 0,
      framelength: 200,
      voiceHandlerTitle: "",
      isShow: false,
      columns6: [
        {
          title: "消息状态", // '推送频率',
          key: "status", // 'frequencyDes',
          align: "center",
          render: (h, params) => {
            if (this.data1[params.index].status === "审核未通过") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      marginTop: "10px",
                      display: "inline-block"
                    }
                  },
                  "审核未通过"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    },
                    style: {
                      width: "80%",
                      display: "flex",
                      "justify-content": "center"
                    },
                    on: {
                      click: () => {
                        alert("审核未通过");
                      }
                    }
                  },
                  "查看原因"
                )
              ]);
            } else if (this.data1[params.index].status === "审核通过") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      marginTop: "10px",
                      display: "inline-block"
                    }
                  },
                  "审核通过"
                )
              ]);
            } else if (this.data1[params.index].status === "上线中") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      marginTop: "10px",
                      display: "inline-block"
                    }
                  },
                  "上线中"
                )
              ]);
            } else if (this.data1[params.index].status === "已下线") {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      marginTop: "10px",
                      display: "inline-block"
                    }
                  },
                  "已下线"
                )
              ]);
            }
            return h("div", [
              h(
                "span",
                {
                  style: {
                    marginTop: "10px",
                    display: "inline-block"
                  }
                },
                "审核中"
              )
            ]);
          }
        }
      ],
      data6: [],
      url: "",
      play: false,
      class_info: [
        {
          classid: 1,
          classname: "(1)班",
          teacherid: 11202,
          checked: false,
          students: [
            {
              id: 1112,
              name: "zs"
            },
            {
              id: 1113,
              name: "ls"
            },
            {
              id: 1114,
              name: "ww"
            }
          ],
          checked_students: []
        },
        {
          classid: 2,
          classname: "(2)班",
          teacherid: 11202,
          checked: false,
          students: [
            {
              id: 2112,
              name: "1zs"
            },
            {
              id: 2113,
              name: "wls"
            },
            {
              id: 2114,
              name: "aww"
            }
          ],
          checked_students: []
        },
        {
          classid: 3,
          classname: "(3)班",
          teacherid: 11202,
          checked: false,
          students: [
            {
              id: 1212,
              name: "zsw"
            },
            {
              id: 1313,
              name: "lsd"
            }
          ],
          checked_students: []
        }
      ],
      isIndeterminate: [],
      show_stu: [],
      useDefaultUI: true,
      options: {
        // for options prop
        cssMaxWidth: 700,
        cssMaxHeight: 1000
      },
      checkGroup: [],
      indeterminate: true,
      checkAll: false,
      checkAllGroup: [],
      columns: [
        // {
        //   type: "expand",
        //   width: 50,
        //   render: (h, params) => {
        //     return h(Expand, {
        //       props: {
        //         row: params.row
        //       }
        //     });
        //   }
        // },
        {
          title: "Name",
          key: "name",
          tooltip: true,
          render: (h, params) => {
            let texts = params.row.name;
            // if (params.row.name.length > 4) {
            //   texts = params.row.name.substring(0,4)+"......";
            // } else {
            //   texts = params.row.name;
            // }
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  texts,
                  h(
                    "span",
                    {
                      slot: "content",
                      style: {
                        whiteSpace: "normal"
                      }
                    },
                    params.row.name
                  )
                ]
              )
            ]);
          }
        },
        {
          title: "Age",
          key: "age",
          filters: [
            {
              label: "最近一周",
              value: 1
            },
            {
              label: "最近一个月",
              value: 2
            },
            {
              label: "最近三个月",
              value: 3
            }
          ],
          filterRemote(value) {
            console.log(value);
          }
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "status",
          key: "status"
        },
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 200,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {}
                  }
                },
                "推送"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "不推送"
              )
            ]);
          }
        }
      ],
      voiceChangeColumns: [
        {
          type: "expand",
          width: 50,
          render: (h, params) => {
            return h(Expand, {
              props: {
                row: params.row
                // _disableExpand: true
              }
            });
          }
        },
        {
          title: "语音",
          key: "address"
        },
        {
          title: "Action",
          key: "action",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.play = true;
                      this.url =
                        "http://192.168.1.53:9000/localvoice/20181119100143/blob(1)";
                      //  this.use_audio_play("http://192.168.1.54:9000/localvoice/20181122005343/2582-155972-2.wav");
                    }
                  }
                },
                "View"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  }
                },
                "Edit"
              )
            ]);
          }
        }
      ],
      tableData: [
        {
          name: "cc",
          age: 18,
          address: "长宁区",
          list: [{ hobby: "ll" }]
        },
        {
          name: "dd",
          age: 66,
          address: "普陀区",
          list: [{ hobby: "tt" }]
        },
        {
          name: "aa",
          age: 3,
          address: "闵行区",
          list: [{ hobby: "jj" }]
        }
      ],
      scrollTableData: [
        {
          name: "我爱北京天安门，hello，哈哈哈，嘿嘿",
          age: 18,
          address: "长宁区",
          status: 1,
          list: [{ hobby: "ll" }]
        },
        {
          name: "dd",
          age: 66,
          address: "普陀区",
          status: 2,
          list: [{ hobby: "tt" }]
        },
        {
          name: "aa",
          age: 3,
          address: "闵行区",
          status: 1,
          list: [{ hobby: "jj" }]
        },
        {
          name: "cc",
          age: 18,
          address: "长宁区",
          status: 2,
          list: [{ hobby: "ll" }]
        },
        {
          name: "dd",
          age: 66,
          address: "普陀区",
          status: 2,
          list: [{ hobby: "tt" }]
        },
        {
          name: "aa",
          age: 3,
          address: "闵行区",
          status: 1,
          list: [{ hobby: "jj" }]
        }
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
        ]
      },
      buttonArr: ["整体分析", "错题整理", "提分训练"],
      activeBtn: 0,
      btnArr: [
        { a: "按钮1", b: 1 },
        { a: "按钮2", b: 2 },
        { a: "按钮3", b: 3 }
      ],
      toggleModal: false,
      toggleModaltitle: "",
      modal_show: false,
      modal_title: "",
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      value: false,
      value1: false,
      value2: false,
      formInfo: {},
      showEdit: false,
      arr: [
        { id: 0, name: "cc", age: 18, gender: "male", hobby: "basketball" },
        { id: 1, name: "aa", age: 6, gender: "female", hobby: "piano" },
        { id: 2, name: "tt", age: 55, gender: "female", hobby: "fly kites" },
        { id: 3, name: "dd", age: 48, gender: "male", hobby: "footerball" }
      ],
      spectrogramChart: "",
      chartData: [],
      showSpectrogramFlag: false
    };
  },
  computed: {
    frameshift() {
      let start = -100;
      let end = -20;
      let len = Math.abs(end - start) / 5 + 1;
      let step = 5;
      return Array.apply(null, { length: Math.abs(len) })
        .map(() => (end -= step))
        .map(e => (e += step))
        .map(e => `${e}dB`);
    }
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url =
        "https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar";
      file.name = "7eb99afb9d5f317c912f08b5212fd69a";
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，请上传 jpg 或 png 格式的图片。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超过 2M。"
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "最多只能上传 5 张图片。"
        });
      }
      return check;
    },
    openModal(title) {
      this.isShow = true;
      this.voiceHandlerTitle = title;
    },
    cancel() {
      console.log("1");
      this.isShow = false;
    },
    submit() {
      this.isShow = false;
      console.log("2");
    },
    use_audio_play(download_path) {
      const $audio = document.createElement("audio");
      document.body.appendChild($audio);
      $audio.setAttribute("src", download_path);
      $audio.setAttribute("controls", "controls");

      // $audio.style.height = '0px';
      // $audio.style.width = '0px';
    },
    get_class_student(id) {
      axios({ url: `http://localhost:10001/api/class/students/${id}` });
    },
    publish() {
      const checked_classes = this.class_info.filter(
        item => item.checked_students.length > 0
      );
      console.log("checked_classes", checked_classes);
    },
    clasa_checked(index) {
      this.isIndeterminate[index] = false;
      if (this.class_info[index].checked) {
        console.log("选中班级");
        if (
          this.class_info[index].students &&
          this.class_info[index].students.length >= 1
        ) {
          const stus = [];
          this.class_info[index].students.forEach(item => stus.push(item.id));
          this.$set(this.class_info[index], "checked_students", stus);
        } else {
          let id = this.class_info[index].classid;
          axios({
            url: `http://localhost:10001/api/class/students/${id}`
          }).then(resource => {
            // console.log('res',res.data.data);
            this.$set(this.class_info[index], "students", resource.data.data);
            const stus = [];
            resource.data.data.forEach(item => stus.push(item.id));
            this.$set(this.class_info[index], "checked_students", stus);
          });
        }
      } else {
        this.$set(this.class_info[index], "checked_students", []);
      }
    },
    student_checked(val, index) {
      const checkedCount = val.length;
      // console.log(val,index)
      // console.log('this.class_info[index]',this.class_info[index]);
      // return
      this.$set(
        this.class_info[index],
        "checked",
        checkedCount === this.class_info[index].students.length
      );
      this.$set(
        this.isIndeterminate,
        index,
        checkedCount > 0 &&
          checkedCount < this.class_info[index].students.length
      );
    },
    /**
     * 点击指定学生，显示和隐藏学生列表
     * - val: 下标
     * - id: 班级id
     */
    appoint_stu(val, id) {
      this.$set(this.show_stu, val, !this.show_stu[val]);
    },
    editHandler() {
      // alert('bj')
      var ImageEditor = require("tui-image-editor");
      // var blackTheme = require("/js/theme/black-theme.js");
      var ImageEditor = require("tui-image-editor");
      var instance = new ImageEditor(document.querySelector("#waveform-0"), {
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70
        }
      });
      return;
      var instance = new ImageEditor(document.querySelector("#waveform-0"), {
        includeUI: {
          loadImage: {
            path: "img/sampleImage.jpg",
            name: "SampleImage"
          },
          // theme: blackTheme, // or whiteTheme
          initMenu: "filter",
          menuBarPosition: "bottom"
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70
        }
      });
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.checkAllGroup = ["香蕉", "苹果", "西瓜"];
      } else {
        this.checkAllGroup = [];
      }
    },
    checkAllGroupChange(data) {
      console.log("data", data);
      if (data.length === 3) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    pdfHandler() {
      const pdfTitle = "全国声纹中心鉴定报告";
      const reportId = "No.126543";
      const docDefinition = {
        content: [
          { text: "全国声纹中心", style: "subheader" },
          { text: "鉴定报告", style: "header" },
          "编号：",
          reportId,
          {
            // style: 'tableExample',
            table: {
              widths: [100, 200, "*"],
              body: [
                [
                  { text: "鉴定过程说明", alignment: "center" },
                  { text: "鉴定结论列表", alignment: "center" },
                  { text: "综合结论", alignment: "center" }
                ],
                [
                  {
                    stack: [
                      "过程主要由以下几步构成",
                      {
                        ul: ["1.略略略", "2.略略略"]
                      }
                    ]
                  },
                  [
                    {
                      style: "tableExample",
                      table: {
                        widths: [120, "*"],
                        body: [
                          ["内容", "专家名称"],
                          ["1", "专家1"],
                          ["1", "专家2"],
                          ["1", "专家3"]
                        ]
                      },
                      alignment: "center"
                    }
                  ],
                  { text: "...... ", alignment: "center" }
                ]
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
            alignment: "center"
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center"
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            alignment: "center"
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: "black"
          },
          table: {
            alignment: "center"
          }
        },
        defaultStyle: {
          font: "zh"
        }
      };
      pdfMake.fonts = pdfFonts.pdfMake.fonts = {
        zh: {
          normal: "zh.ttf",
          bold: "zh.ttf",
          italics: "zh.ttf",
          bolditalics: "zh.ttf"
        }
      };
      pdfMake.createPdf(docDefinition).download(`${pdfTitle}.pdf`);
    },
    voiceChangeHandler(rows) {
      console.log("voiceChangeHandler", rows);
    },
    enableExpand(row, status) {
      // console.log(row,status);
      if (status) {
        row;
      }
    },
    createWavesurferInstance(id) {
      return WaveSurfer.create({
        container: `#waveform-${id}`,
        waveColor: "violet",
        progressColor: "purple"
      });
    },
    getA() {
      return new Promise(resolve => {
        axios({ url: "http://localhost:10001/api/promiseA" }).then(res => {
          resolve(res.data);
        });
      });
    },
    getB() {
      axios({ url: "http://localhost:10001/api/promiseB" });
    },
    get_ajax_data() {
      return new Promise(resolve => {
        axios({
          method: "GET",
          url: "http://localhost:10001/api/keyword"
        }).then(res => resolve(res.data));
      });
    },
    async transferProject() {
      let arr = [1];
      let promise = arr.map(() => this.get_ajax_data());
      let result = Promise.all(promise);
      console.log("transferProject", result);
    },
    result(id) {
      return new Promise(resolve => {
        axios({ url: `http://localhost:10001/api/promise/${id}` }).then(res => {
          console.log("res.data.data", res.data.data);
          resolve(res.data.data);
        });
      });
    },
    async getPromiseResult() {
      let docs = [1, 2, 3];
      let promises = docs.map(doc => this.result(doc));
      let results = await Promise.all(promises);

      // let result = this.result();
      console.log("results", results);
    },
    async getPromiseResultA() {
      let a = await this.getA();
      console.log("a", a);
      // let result = this.getA();
      // console.log('result',result);
    },
    getPromiseResultB() {
      let result = this.getB();
      console.log("result", result);
    },
    toggleFormInfo() {
      let arr = this.arr;
      this.formInfo = arr[parseInt(Math.random() * 4)];
    },
    editFormInfo() {
      this.showEdit = true;
    },
    saveFormInfo(data) {
      console.log("接收子组件的数据", data);
      this.showEdit = false;
      let arr = this.arr;
      arr.forEach(el => {
        if (el.id === data.id) {
          el = data.formData;
          return;
        }
      });
    },
    //锚点跳转
    goAnchor(selector, index) {
      let d = new Date();
      console.log("d", d.getTime());
      return;
      this.activeBtn = index;
      // this.$el.querySelector(selector).scrollIntoView();//当区块高度过大时，可实现锚点的效果
      // document.querySelector("#app-root").scrollTop = this.$el.querySelector(selector).offsetTop;//不生效
      document.documentElement.scrollTop = this.$el.querySelector(
        selector
      ).offsetTop; //当区块高度过大时，可实现锚点的效果
      // console.log('this.$el.querySelector(selector).offsetTop',this.$el.querySelector(selector).offsetTop)
      // console.log('document.querySelector("#app-root")',document.querySelector("#app-root"))
    },
    showModal(id) {
      this.dialogShow = true;
      this.dialogTitle = `标题${id}`;
      return;
      console.log("modalid", id);
      this.toggleModal = true;
      this.toggleModaltitle = `标题${id}`;
      return;
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
    initSpectrogram(chartData = []) {
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
      window.addEventListener("resize", function() {
        mycharts.resize();
      });
    },
    initLine() {
      let mycharts = echarts.init(document.getElementById("line"));
      let option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      mycharts.setOption(option);
      window.addEventListener("resize", function() {
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
    complete1(boo, obj) {
      this[obj] = boo;
    }
  },
  created() {
    // axios({ url: "http://localhost:10001/api/checkboxgroup" }).then(res => {
    //   console.log(res.data.data);
    //   this.checkGroup = res.data.data;
    // });
    var regex = /task/;
    var string = "tas";
    console.log(regex.test(string));
  },
  mounted() {
    return
    this.uploadList = this.$refs.upload.fileList;
    let fileArr = [
      {
        id: 0,
        url: "http://192.168.1.53:9000/localvoice/20180906091507/战斗声纹.wav"
      }
      // {
      //   id: 1,
      //   url: "static/audio/何小萍-G-1.wav"
      // },
      // {
      //   id: 2,
      //   url: "static/audio/陈硕琦-G-1.wav"
      // },
      // {
      //   id: 3,
      //   url: "static/audio/顾敏-G-1.wav"
      // }
    ];
    this.fileArr = fileArr;

    this.$nextTick(() => {
      let instanceArr = [];
      fileArr.forEach(el => {
        instanceArr.push({
          instance: this.createWavesurferInstance(el.id),
          url: el.url
        });
      });
      instanceArr.forEach(el => el.instance.load(el.url));
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
        });
      }
    },
    showSpectrogramFlag: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        this.spectrogramChart.resize();
      }
    }
  }
};
</script>
<style scoped lang="less">
// @import "@toast-ui/";
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.ivu-table-overflowY {
  /* 设置滚动条的样式 */
  &::-webkit-scrollbar {
    width: 30px;
    background-color: #bfbfbf;
  }
  /* 滚动槽 */
  &::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 30px;
    // height: 16px;
    background: #7d7d7d;
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }
}
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