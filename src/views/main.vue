<script setup lang="ts">
import { reactive, ref, Ref, watch, onMounted, createVNode } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {
  getTabList,
  getAppList,
  addTab,
  editTab,
  delTab,
  addURL,
  updateURL,
  delURL,
} from '@/api/index.js'
import { notification, Modal } from 'ant-design-vue'
//定义接口
interface tabList {
  tabId: number
  tabName: string
}
interface appList {
  tabId: number
  urlName: string
  id: number
  url: string
  icon: string
}

// 搜索输入框值
let searchValue = ref('')
// 搜索下拉框选值
let value3 = ref('')
// tabs当选值
let activeKey = ref('')
// 新增标签弹出框状态
let visibleModel = ref(false)
// 删除标签弹出框状态
let visibleModelDel = ref(false)
let listLoading = ref(false)
// 新增的tabName
let modalForm = reactive({
  tabId: '',
  tabName: '',
})
// 抽屉状态
let visibleDrawer = ref(false)
// 抽屉form
let drawerForm = reactive({
  name: '',
  url: '',
  urlId: '',
})
// 判断是新增还是修改
let isSubmit = ref(false)
//  弹出框下的表单元素
let drawerFormEle = ref()
// 定义一个App列表数据
let appList = ref([]) as Ref<Array<appList>>
// 定义一个tabs列表数据
let tabList = ref([]) as Ref<Array<tabList>>

// 搜索按钮
const onSearch = () => {
  window.open(`https://www.baidu.com/s?wd=${searchValue.value}&ie=utf-8`)
}

// 获取tab列表数据
let getTabListData = () => {
  listLoading.value = true
  getTabList().then(({ data }) => {
    tabList.value = data
    activeKey.value = data[0].tabId
    getAppListData(data[0].tabId)
    listLoading.value = false
  })
}
getTabListData()
// tabs组件change事件
let handleTabsChange = value => {
  // app数据请求
  getAppListData(value)
}

// 弹出新增框事件
const showAddTab = () => {
  visibleModel.value = true
  // 判断是新增
  isSubmit.value = true
}
// 编辑tab框状态事件
let handleTabListShow = () => {
  visibleModelDel.value = true
}
// tab框中修改按钮
let handleEditTab = item => {
  modalForm.tabName = item.tabName
  modalForm.tabId = item.tabId
  // 判断是新增
  isSubmit.value = false
  visibleModel.value = true
}

// tab框中删除按钮
let handleDelTab = item => {
  modalForm.tabId = item.tabId
  Modal.confirm({
    title: () => '删除',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => ` 确定删除${item.tabName}标签页吗？`,
    centered: true,
    okText: '确定',
    cancelText: '取消',
    onOk() {
      delTab(item.tabId).then(({ msg }) => {
        // 成功提示
        notification.success({
          message: msg,
        })
        // 重新获取数据
        getTabListData()
      })
    },
  })
}

// 新增框确认事件
let modalFormEle = ref() //  弹出框下的表单元素
let modalConfirmLoading = ref(false) // 确定按钮加载状态
const handleModalOkClick = () => {
  // 表单验证
  modalFormEle.value.validate().then(() => {
    modalConfirmLoading.value = true
    // 判断是新增还是修改
    if (isSubmit.value) {
      addTab({ tabName: modalForm.tabName }).then(({ msg }) => {
        // 成功提示
        notification.success({
          message: msg,
        })
        // 弹出框隐藏
        visibleModel.value = false
        modalConfirmLoading.value = false
        // 重新获取数据
        getTabListData()
      })
    } else {
      let params = {
        tabId: modalForm.tabId,
        tabName: modalForm.tabName,
      }
      editTab(params).then(({ msg }) => {
        // 成功提示
        notification.success({
          message: msg,
        })
        // 弹出框隐藏
        visibleModel.value = false
        modalConfirmLoading.value = false
        // 重新获取数据
        getTabListData()
      })
    }
  })
}

// 抽屉取消事件
const onClose = () => {
  visibleDrawer.value = false
  drawerFormEle.value.clearValidate()
}
// url添加更多按钮
const moreBtn = () => {
  visibleDrawer.value = true
  isSubmit.value = true
}
// 抽屉确认提交按钮
let submitURL = () => {
  // 表单验证
  if (isSubmit.value) {
    drawerFormEle.value.validate().then(() => {
      let params = {
        urlName: drawerForm.name,
        url: drawerForm.url,
        tabId: activeKey.value,
      }
      addURL(params).then(({ msg }) => {
        // 成功提示
        notification.success({
          message: msg,
        })
        // 弹出框隐藏
        visibleDrawer.value = false
        // 出现获取数据
        getAppListData(activeKey.value)
      })
    })
  } else {
    drawerFormEle.value.validate().then(() => {
      console.log(drawerForm)
      let params = {
        urlName: drawerForm.name,
        url: drawerForm.url,
        urlId: drawerForm.urlId,
      }
      updateURL(params).then(({ msg }) => {
        // 成功提示
        notification.success({
          message: msg,
        })
        // 弹出框隐藏
        visibleDrawer.value = false
        // 出现获取数据
        getAppListData(activeKey.value)
      })
    })
  }
}
// 获取appList 函数
let spinning = ref(false)
function getAppListData(tabId) {
  spinning.value = true
  getAppList({ tabId }).then(({ data }) => {
    let myRegExp = new RegExp('^[a-zA-Z]')
    data.forEach(item => {
      let letter = myRegExp.exec(item.urlName)
      let icon: string | null
      if (letter) {
        icon = letter[0].toLowerCase()
      } else {
        icon = 'public'
      }
      item.icon = icon
    })
    spinning.value = false
    appList.value = data
  })
}

/*
  url 右击编辑的菜单
*/
let showFunBlock = ref(false)
// 获取功能框元素
let funBlock = ref()
// 判断是否当选
let isActive = ref()
// 中间存储器
let urlData = {
  urlName: '',
  url: '',
  urlId: '',
}
// app右击编辑设置事件
let handleRightClick = (data, e) => {
  // 选中的url参数
  urlData.urlName = data.urlName
  urlData.url = data.url
  urlData.urlId = data.id
  // 用于判断哪个url选中
  isActive.value = data.id
  // 设置功能框的位置
  funBlock.value.style.top = e.clientY + 1 + 'px'
  funBlock.value.style.left = e.clientX + 1 + 'px'
  // 显示功能框
  showFunBlock.value = true
}
// 编辑按钮
let functionalEdit = () => {
  // 显示修改框
  visibleDrawer.value = true
  // 判断是新增还是修改
  isSubmit.value = false
  // 参数
  drawerForm.name = urlData.urlName
  drawerForm.url = urlData.url
  drawerForm.urlId = urlData.urlId
}
// 删除按钮
let functionalDel = () => {
  delURL(urlData.urlId).then(({ msg }) => {
    // 成功提示
    notification.success({
      message: msg,
    })
    // 出现获取数据
    getAppListData(activeKey.value)
  })
}
// 全局监听
window.addEventListener('click', () => {
  showFunBlock.value = false
  isActive.value = ''
})

/* 监听 */
watch(visibleModel, (newVlaue, oldValue) => {
  if (!newVlaue) {
    // 如果取消弹出框 ，清空输入框内容
    modalForm.tabName = ''
  }
})
watch(visibleDrawer, (newVlaue, oldValue) => {
  if (!newVlaue) {
    // 如果取消弹出框 ，清空输入框内容
    drawerForm.name = ''
    drawerForm.url = ''
    drawerForm.urlId = ''
  }
})
</script>

<template>
  <div class="container">
    <!-- 搜索栏 -->
    <div class="header">
      <div class="bar">切换菜单12456</div>
      <div class="search">
        <a-input-search
          v-model:value="searchValue"
          placeholder="百度"
          enter-button
          @search="onSearch"
          class="search-input"
          size="large"
        >
          <!-- <template #addonBefore>
            <a-select v-model:value="value3" size="large" style="width: 100px">
              <a-select-option value="Zhejiang">Zhejiang</a-select-option>
              <a-select-option value="Jiangsu">Jiangsu</a-select-option>
            </a-select>
          </template> -->
        </a-input-search>
      </div>
    </div>
    <div class="content">
      <!-- 添加标签 -->
      <a-tooltip>
        <template #title>
          <span>新增标签菜单</span>
        </template>
        <a-button
          type="primary"
          @click="showAddTab"
          @click.right.prevent="handleTabListShow"
          class="add"
        >
          <template #icon><PlusOutlined /></template>
        </a-button>
      </a-tooltip>
      <!-- 切换标签 -->
      <a-tabs
        v-model:activeKey="activeKey"
        type="editable"
        animated
        class="tabs"
        @change="handleTabsChange"
      >
        <a-tab-pane
          :closable="false"
          class="tab"
          v-for="tab in tabList"
          :key="tab.tabId"
          :tab="tab.tabName"
        >
          <!-- 加载spin -->
          <div v-show="spinning" class="spin">
            <a-spin tip="Loading..." />
          </div>

          <!-- url ；列表 -->
          <div
            class="item"
            v-for="app in appList"
            :key="app.id"
            v-show="!spinning"
            :class="{ active: isActive == app.id }"
            @click.right.prevent="handleRightClick(app, $event)"
          >
            <div class="item-img mark-box">
              <SvgIcon :iconClass="app.icon"></SvgIcon>
              <a :href="app.url" target="_blank" class="mark"></a>
            </div>
            <a-tooltip placement="bottom" class="item-span">
              <template #title>
                <span>{{ app.urlName }}</span>
              </template>
              <span class="span">{{ app.urlName }}</span>
            </a-tooltip>
          </div>
          <div class="item">
            <a-button class="item-img" @click="moreBtn">
              <template #icon><PlusOutlined /></template>
            </a-button>
            <div class="item-span">
              <span class="span">更多</span>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <!-- 添加tab弹出框 -->
  <a-modal
    v-model:visible="visibleModel"
    :title="isSubmit ? '新增' : '修改'"
    @ok="handleModalOkClick"
    :maskClosable="false"
    centered
    :okText="isSubmit ? '确认' : '修改'"
    cancelText="取消"
    :confirmLoading="modalConfirmLoading"
    zIndex="1001"
  >
    <a-form :model="modalForm" name="basic" ref="modalFormEle">
      <a-form-item
        label="标签页名称"
        name="tabName"
        :rules="[{ required: true, message: '请输入标签名称!' }]"
      >
        <a-input
          v-model:value="modalForm.tabName"
          placeholder="请输入标签页名"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 删除Tab弹出框 -->
  <a-modal
    v-model:visible="visibleModelDel"
    title="编辑tab"
    :footer="null"
    centered
  >
    <a-list
      class="demo-loadmore-list"
      item-layout="horizontal"
      :data-source="tabList"
      :loading="listLoading"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a @click="handleEditTab(item)">修改</a>
            <a @click="handleDelTab(item)" style="color: red">删除</a>
          </template>
          <a-list-item-meta>
            <template #title> {{ item.tabName }} </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>

  <!-- 底部弹出层 -->
  <a-drawer
    placement="bottom"
    :closable="false"
    :visible="visibleDrawer"
    @close="onClose"
    :drawerStyle="{ backgroundColor: '#333', paddingTop: '35px' }"
  >
    <a-form :model="drawerForm" ref="drawerFormEle" class="drawer-form">
      <a-row :gutter="16" align="middle">
        <a-col :span="6">
          <a-form-item
            name="name"
            :rules="[{ required: true, message: '请输入名称!' }]"
          >
            <a-input
              v-model:value="drawerForm.name"
              placeholder="输入标题"
              class="bg"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="17">
          <a-form-item
            name="url"
            :rules="[{ required: true, message: '请输入地址!' }]"
          >
            <a-input
              v-model:value="drawerForm.url"
              placeholder="输入网址"
              class="bg"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="1">
          <a-form-item>
            <a-button type="primary" @click="submitURL" size="large"
              >确定</a-button
            >
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>

  <!-- 右击弹出的功能框 -->
  <ul ref="funBlock" v-show="showFunBlock" class="functional_block">
    <li class="block-btn" @click="functionalEdit">编辑</li>
    <li class="block-btn" @click="functionalDel">删除</li>
  </ul>
</template>

<style lang="scss" scoped>
.header {
  min-width: 1030px;
  height: 200px;
  background-image: url('@/assets/images/bg/banner.jpg');
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeats;
  font-size: 16px;
  .bar {
    padding: 20px;
    font-size: 16x;
    color: #fff;
  }
  .search {
    text-align: center;
    :deep(.ant-input-group-addon
        .ant-select.ant-select-single:not(.ant-select-customize-input)
        .ant-select-selector) {
      background-color: #fff;
    }
    :deep(.ant-btn-lg) {
      // height: 53px;
      font-size: 0.33rem;
    }
    :deep(.ant-input-group-wrapper) {
      border-radius: 5px;
      overflow: hidden;
    }
    .search-input {
      width: 700px;
      :deep(.ant-btn-lg) {
        height: 100%;
      }
      :deep(.ant-input-lg) {
        font-size: 20px;
        height: 55px;
      }
    }
  }
}

.content {
  padding: 20px;
  width: 60%;
  min-width: 1080px;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(156, 176, 184, 0.31);
  border-radius: 10px;
  .add {
    position: absolute;
    right: 0;
    top: 0px;
    z-index: 100;
    width: 45px;
    height: 45px;
  }
  .tab {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    position: relative;
    margin: 10px;
    .spin {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      z-index: 1000;
    }
    .mark-box {
      position: relative;
    }
    .mark {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 99;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.05;
      &:hover {
        opacity: 0.2;
      }
    }
    .active {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .item {
      text-align: center;
      overflow: hidden;
      margin: 10px 10px 20px 10px;
      flex: 0 0 8%; //flex-group flex-shirk flex-basis
      &:hover {
        cursor: pointer;
      }

      .item-span {
        margin-top: 5px;
      }
      :deep(.span) {
        width: 100%;
        white-space: nowrap; /*强制span不换行*/
        display: inline-block; /*将span当做块级元素对待*/
      }
      .item-img {
        width: 45px;
        height: 45px;
        border-radius: 7px;
        overflow: hidden;
        margin: 0 auto;
        img {
          width: 100%;
          width: 100%;
        }
      }
    }
  }
}

.drawer-form {
  width: 50%;
  margin: 0 auto;
  :deep(.ant-input) {
    background-color: #414141;
    border: none;
    color: #ccc;
  }
}
.functional_block {
  padding: 0;
  border-radius: 10px;
  @include box-shadow;
  position: fixed;
  list-style: none;
  z-index: 999;
  background-color: #fff;
  overflow: hidden;
  cursor: pointer;
  .block-btn {
    padding: 5px;
    width: 100px;
    text-align: center;
    font-size: 12px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
