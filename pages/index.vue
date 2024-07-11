
<template>

  <v-container>
    <v-col align="right">
      <table>
        <thead>
          <tr>
            <th style="width:33%">Metal</th>
            <th style="width:33%">Rate (AUD)</th>
            <th style="width:33%">Change (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rate, metal) in metalRates" :key="metal">
            <td>
              {{ metal }}
            </td>
            <td align="right">
              {{ (1/rate.current).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }} 
            </td>
            <td align="right">
              {{ rate.change ? rate.change.toFixed(2): '-' }}
            </td>
          </tr> 
        </tbody>
      </table>

      <table>
        <thead>
          <th style="width:33%">Currency</th>
          <th style="width:33%">Rate (AUD)</th>
          <th style="width:33%">Change (%)</th>
        </thead>
        <tbody>
          <tr v-for="(rate, currency) in currencyRates" :key="currency">
            <td>
              {{ currency }}
            </td>
            <td align="right">
              {{ rate.current.toLocaleString('en-AU', {style: 'currency', currency:'AUD'}) }}
            </td>
            <td align="right">
              {{ rate.change ? rate.change.toFixed(2): '-' }}
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
import { reactive ,computed, onMounted} from 'vue';
import dayjs from 'dayjs';

export default {
  setup(){
    let data = reactive({
      rates: {},
      previousRates: {},
    });
    

    const apiURL ='https://api.metalpriceapi.com/v1/';
    const apiKEY = 'bb7c73b07cf23654d4ee15b68926f81d';
    
// process.env.VUE_APP_API_KEY not currently working follow up needed

    const getRates = () => {
      axios(`${apiURL}latest?api_key=${apiKEY}&base=AUD&currencies=XAU,XAG,XPD,XPT,USD,EUR,GBP,CNY`).then(response => {
        const rates = response.data.rates;
        data.rates = {};

        //Processing the API output
        for(const [key, value] of Object.entries(rates)){
            const currency = key.startsWith('AUD') ? key.replace('AUD', ''): key;
            data.rates[currency] = {current: value};

        }
        const previousDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        axios(`${apiURL}${previousDay}?api_key=${apiKEY}&base=AUD&currencies=XAU,XAG,XPD,XPT,USD,EUR,GBP,CNY`).then(response =>{
          const previousRates = response.data.rates;
          data.previousRates = {};

          for(const [key, value] of Object.entries(previousRates)){

            const currency = key.startsWith('AUD') ? key.replace('AUD', ''): key;
              data.previousRates[currency]=value;
          }


          for(const key in data.rates){
            if(data.previousRates[key]){
                data.rates[key].change = ((data.rates[key].current -data.previousRates[key])/ data.previousRates[key])*100;
            }

          }
        });  
      });
    };
// All precious Metals in Troy ounces
// XAU - Gold, XAG - Silver, XPD - Palladium, XPT - Platinum
    const metalRates = computed(()=>{
      return {
        XAU: data.rates.XAU ||{},
        XAG: data.rates.XAG ||{},
        XPD: data.rates.XPD ||{},
        XPT: data.rates.XPT ||{}
      };
    });

    const currencyRates = computed(()=>{
        let rates ={...data.rates};
        delete rates.XAU;
        delete rates.XAG;
        delete rates.XPD;
        delete rates.XPT;
        return rates;
    });

    onMounted(()=>{
      getRates();
    })

    return {
      data,
      getRates,
      metalRates,
      currencyRates
    }
  }
}
</script>
