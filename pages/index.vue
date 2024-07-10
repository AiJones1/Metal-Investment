<template>
  <v-container>
    <v-row justify="center">
     <h1>Investment Gold and Silver</h1>
    </v-row>
    <v-col align="left">
      <h2>Precious Metal Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Metal</th>
            <th>Rate (AUD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rate, metal) in metalRates" :key="metal">
            <td >
              {{ metal }}
            </td>
            <td >
              {{ (1/rate).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }} 
            </td>
          </tr> 
        </tbody>
      </table>
      <h2>Exchange Rates</h2>
      <table>
        <thead>
          <th>Currency</th>
          <th>Rate (AUD)</th>
        </thead>
        <tbody>
          <tr v-for="(rate, currency) in currencyRates" :key="currency">
            <td>
              {{ currency }}
            </td>
            <td>
              {{ rate.toLocaleString('en-AU', {style: 'currency', currency:'AUD'}) }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <v-btn @click="getRates()">Check for Updates</v-btn>
    </v-col>


  </v-container>
</template>

<script>
import axios from 'axios';
import { reactive ,computed} from 'vue';

export default {
  setup(){
    let data = reactive({
      rates: {}
    });
    const apiURL ='https://api.metalpriceapi.com/v1/latest'
    const apiKEY = 'bb7c73b07cf23654d4ee15b68926f81d'

    const getRates = ()=>{
      axios(`${apiURL}?api_key=${apiKEY}&base=AUD&currencies=XAU,XAG,USD,EUR`).then(response =>{
        const rates = response.data.rates;
        data.rates ={};

        //Processing the API output
        for(const [key, value] of Object.entries(rates)){
          if(key.startsWith('AUD')){
            const currency = key.replace('AUD','');
            data.rates[currency] = value;
          }else{
            data.rates[key]=value;
          }
        }
      });
    };

    const metalRates = computed(()=>{
      return {
        XAU: data.rates.XAU,
        XAG: data.rates.XAG
      };
    });

    const currencyRates = computed(()=>{
        let rates ={...data.rates};
        delete rates.XAU;
        delete rates.XAG;
        return rates;
    });

    return {
      data,
      getRates,
      metalRates,
      currencyRates
    }
  }
}

</script>
