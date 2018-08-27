<template>
  <div class="relay-app-manage">
    <div  class="el_content">
      <!--面包屑-->
      <Crumbs :crumbs="crumbsList" />
			<div class="relay-app-manage-content">
				<a download :href="downloadUrl+'/rds-etl.zip'" class="el-button  el-button--primary">中继应用下载</a>
			</div>
    </div>
  </div>
</template>
<script>
	export default {
		name: "relayAppManage",
		data() {
			return {
				msg: "中继应用管理",
				crumbsList: [
					//  面包屑
					{
						name: "中继应用管理",
						url: {
							routerName: "systemManage",
							params: { name: "relayAppManage" }
						}
					}
				]
			};
		},
		mounted() {},
		methods: {}
	}
</script>

<style  lang="less" type="text/less">
	.relay-app-manage {
		.relay-app-manage-content {
			padding-top: 20px;
		}
	}
</style>
