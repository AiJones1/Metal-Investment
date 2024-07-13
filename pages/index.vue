
<template>

  <v-container>
    <v-col >
      <table>
        <thead>
          <tr>
            <th align="left" style="width:33%">Metal</th>
            <th style="width:33%">Price</th>
            <th style="width:33%">Change</th>
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
            <td :class="getChangeClass(rate.change)" align="right">
              {{ rate.change ? rate.change.toFixed(2): '-' }} %
            </td>
          </tr> 
        </tbody>
      </table>

      <table>
        <thead>
          <th align="left" style="width:33%">Currency</th>
          <th style="width:33%">Price</th>
          <th style="width:33%">Change</th>
        </thead>
        <tbody>
          <tr v-for="(rate, currency) in currencyRates" :key="currency">
            <td>
              {{ currency }}
            </td>
            <td align="right">
              {{ rate.current.toLocaleString('en-AU', {style: 'currency', currency:'AUD'}) }}
            </td>
            <td :class="getChangeClass(rate.change)" align="right">
              {{ rate.change ? rate.change.toFixed(2): '-' }} %
            </td>
          </tr>
        </tbody>

        
      </table>
      
      <v-btn @click="getRates()">Check for Updates</v-btn>
      <v-select 
        v-model="baseCurrency"
        :items="availableCurrencies"
        label="Change Currency"
        outlined
        />
    </v-col>
  </v-container>

</template>


<script>
import axios from 'axios';
import { reactive ,computed, onMounted, ref, watch} from 'vue';
import dayjs from 'dayjs';

export default {
  setup(){
    let data = reactive({
      rates: {},
      previousRates: {},
    });
    
    const baseCurrency = ref('AUD');
    const availableCurrencies = ref(['AUD','USD','EUR','GBP','CNY']);
    const apiURL ='https://api.metalpriceapi.com/v1/';
    const apiKEY = import.meta.env.VITE_API_KEY;
    

    const getRates = () => {
      const currencies =availableCurrencies.value.filter(currency => currency !== baseCurrency.value).join(',');

      axios(`${apiURL}latest?api_key=${apiKEY}&base=${baseCurrency.value}&currencies=XAU,XAG,XPD,XPT,${currencies}`).then(response => {
        const rates = response.data.rates;
        data.rates = {};

        //Processing the API output
        for(const [key, value] of Object.entries(rates)){
            const currency = key.startsWith(baseCurrency.value) ? key.replace(baseCurrency.value, ''): key;
            data.rates[currency] = {current: value};

        }
        const previousDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        axios(`${apiURL}${previousDay}?api_key=${apiKEY}&base=${baseCurrency.value}&currencies=XAU,XAG,XPD,XPT,${currencies}`).then(response =>{
          const previousRates = response.data.rates;
          data.previousRates = {};

          for(const [key, value] of Object.entries(previousRates)){
            const currency = key.startsWith(baseCurrency.value) ? key.replace(baseCurrency.value, ''): key;
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

    const getChangeClass =(change)=>{
      if(change===undefined || change ===null) return '';
      return change > 0 ? 'positive' : 'negative';
    }


    onMounted(()=>{
      getRates();
    })

    watch(baseCurrency, ()=>{
      getRates();
    })

    return {
      baseCurrency,
      availableCurrencies,
      data,
      getRates,
      metalRates,
      currencyRates,
      getChangeClass
    }
  }
}
</script>

<style>
.positive {
  color: green;
}
.negative {
  color: red;
}
</style>