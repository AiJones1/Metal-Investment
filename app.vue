<template>
	<div>

		<v-container>
			<v-row class="titleContainer">
				<h1>Precious Metals Investments</h1>
			</v-row>
			<v-row class="accountContainer">
				
				<v-col align="right">
					<v-btn><Icon
						/>Login</v-btn>
					<v-btn>Create Account</v-btn>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="false" md="3"></v-col>
				<v-col cols="12" md="6" class="mainContainer">
					<investment/>
				</v-col>
				<v-col cols="12" md="3" class="tableContainer">
					<index />
				</v-col>
			</v-row>
		</v-container>
	</div>		
</template>

<script setup>
import index from './pages/index.vue'
import investment from './pages/investment.vue'
// import {icon} from '@iconify/vue'

</script>

<style scoped>
.titleContainer {
	justify-content: center;
	align-items: center;
	padding: 8px;
	background-color: rgb(150, 150, 150);
}
.accountContainer {
	background-color: rgb(150, 150, 150);
}
.mainContainer {
	border-left: 1px solid rgb(121, 121, 121);
	border-right: 1px solid rgb(0,0,0.1);
	padding-left: 8px;
	padding-right: 8px;
}
.tableContainer {
	position: relative;
	display: flex;
	justify-content: flex-end;
}
.tableContainer index {
	width: 100%;
}
</style>
