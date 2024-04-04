<template>
  <v-container>

    <h1>Investment Gold and Silver</h1>

    <h2>Currency conversions</h2>
    <table>
      <thead>
        <tr>
          <th>Currency</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rate, currency) in data.currency" :key="currency">
          <td>
            {{ currency }}
          </td>
          <td v-if="currency==='XAU' || currency ==='XAG'">
            {{ (1/rate).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }} 
          </td>
          <td v-else>
            {{ (rate).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }}
          </td>
        </tr> 
      </tbody>
    </table>

    <v-btn @click="getRates()">Get Current Rates</v-btn>


      <!-- <li v-for="(rate, currency) in data.currency" :key="currency">
        <template v-if="currency==='XAU' || currency ==='XAG'">
          {{ currency }}: {{ (1/rate).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }} / ounce
        </template>
        <template v-else>
          {{ currency }}:{{ (rate).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }}
        </template>
        
      </li> -->


  </v-container>
</template>

<script>
import axios from 'axios';
import { reactive } from 'vue';

export default {
  setup(){
    let data = reactive({
      currency: '',
      rate: []
    })
    const apiURL ='https://api.metalpriceapi.com/v1/latest'
    const apiKEY = 'bb7c73b07cf23654d4ee15b68926f81d'

    const getRates = ()=>{
      axios(`${apiURL}?api_key=${apiKEY}&base=AUD&currencies=AUD,XAU,XAG,USD,EUR`).then(response =>{
        console.log(response)
        console.log(response.data.rates)
        data.currency = response.data.rates
      })
    }

    return {
      data,
      getRates
    }
  }
}

</script>
