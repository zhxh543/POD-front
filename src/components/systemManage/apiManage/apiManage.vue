<template>
  <div class="api-manage">
    <div class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
			<div class="api-manage-content">

				<a download :href="downloadUrl+'/API.pdf'" class="el-button  el-button--primary">API接口文档下载</a>
			</div>
    </div>
  </div>
</template>
<script>
	export default {
		name: "apiManage",
		data() {
			return {
				msg: "API接口管理",
				crumbsList: [
					//  面包屑
					{
						name: "API接口管理",
						url: {
							routerName: "systemManage",
							params: { name: "apiManage" }
						}
					}
				]
			};
		},
		mounted() {},
		methods: {}
	}
</script>

<style scoped lang="less" type="text/less">
	.api-manage {
		.api-manage-content {
			padding-top: 20px;
		}
	}
</style>
