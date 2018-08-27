<template>
  <div class="page_right">
    <div class="right_title">布局选择</div>
    <el-row :gutter="20" class="right_box">
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '1-1-0'}" @click="flex('1-1-0')"><img
          src="@/assets/report/img/page1.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-0-1'}" @click="flex('2-0-1')"><img
          src="@/assets/report/img/page2.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '1-2-0'}" @click="flex('1-2-0')"><img
          src="@/assets/report/img/page3.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-0-2'}" @click="flex('2-0-2')"><img
          src="@/assets/report/img/page4.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-1-2'}" @click="flex('2-1-2')"><img
          src="@/assets/report/img/page5.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '3-0-1-2'}" @click="flex('3-0-1-2')"><img
          src="@/assets/report/img/page6.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-2-1'}" @click="flex('2-2-1')"><img
          src="@/assets/report/img/page7.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-2-2'}" @click="flex('2-2-2')"><img
          src="@/assets/report/img/page8.png" alt=""></div>
      </el-col>
      <!--<el-col :span="12">-->
      <!--<div class="right_img" :class="{active:type === '1-4-1'}" @click="flex('1-4-1')"><img src="@/assets/report/img/page9.png" alt=""></div>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<div class="right_img" :class="{active:type === '1-4-2'}" @click="flex('1-4-2')"><img src="@/assets/report/img/page10.png" alt=""></div>-->
      <!--</el-col>-->
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '1-3-0'}" @click="flex('1-3-0')"><img
          src="@/assets/report/img/page11.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-1-3'}" @click="flex('2-1-3')"><img
          src="@/assets/report/img/page12.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-2-3'}" @click="flex('2-2-3')"><img
          src="@/assets/report/img/page13.png" alt=""></div>
      </el-col>
      <el-col :span="12">
        <div class="right_img" :class="{active:type === '2-3-2'}" @click="flex('2-3-2')"><img
          src="@/assets/report/img/page14.png" alt=""></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "right",
    props: ['type'],
    data() {
      return {}
    },
    methods: {
      flex(type) {
        this.$emit('flex', type);
      }
    }
  }
</script>
