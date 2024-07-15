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
      
      <v-btn @click="getCurrentRates()">Check for Updates</v-btn>
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
import { reactive ,computed} from 'vue';

export default {
  setup(){
    let data = reactive({
      rates: {}
    });
    
    const baseCurrency = ref('AUD');
    const availableCurrencies = ref(['AUD','USD','EUR','GBP','CNY']);
    const apiURL ='https://api.metalpriceapi.com/v1/';
    const apiKEY = import.meta.env.VITE_API_KEY;
    let currencies =availableCurrencies.value;
    // const metals =[
    //   {title:'Silver', value:'XAG'},
    //   {title:'Gold', value:'XAU'},
    //   {title:'Platinum', value:'XPT'},
    //   {title:'Paladium', value:'XPD'},
    // ]

    const getRates = () => {
      currencies =availableCurrencies.value.filter(currency => currency !== baseCurrency.value).join(',');

      axios(`${apiURL}latest?api_key=${apiKEY}&base=${baseCurrency.value}&currencies=XAU,XAG,XPD,XPT,${currencies}`).then(response => {
        const rates =processRates(response.data.rates, baseCurrency.value, true);
        data.rates = rates;

        const previousDay = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
        axios(`${apiURL}${previousDay}?api_key=${apiKEY}&base=${baseCurrency.value}&currencies=XAU,XAG,XPD,XPT,${currencies}`).then(response =>{
          const previousRates = processRates(response.data.rates, baseCurrency.value, false);
          data.previousRates = previousRates;


          for(const key in data.rates){
            if(data.previousRates[key]){
                data.rates[key].change = ((data.rates[key].current -data.previousRates[key])/ data.previousRates[key])*100;
            }

          }
        });  
      });
    };

    const processRates =(rates,baseCurrency, isCurrent)=>{
      const processedRates ={};
      for(const [key, value] of Object.entries(rates)){
            const currency = key.startsWith(baseCurrency) ? key.replace(baseCurrency, ''): key;
            if(isCurrent){
              processedRates[currency] = {current:value};
            }else{
              processedRates[currency] = value;
            }
            
        }
        return processedRates;
    };

    const getCurrentRates=()=>{
      currencies =availableCurrencies.value.filter(currency => currency !== baseCurrency.value).join(',');

      axios(`${apiURL}latest?api_key=${apiKEY}&base=${baseCurrency.value}&currencies=XAU,XAG,XPD,XPT,${currencies}`).then(response => {
      const rates =processRates(response.data.rates, baseCurrency.value, true);
      for(const key in rates){
        if(data.previousRates[key]){
          rates[key].change = ((rates[key].current-data.previousRates[key])/data.previousRates[key])*100;
        }
      }
      data.rates = rates;
    });
  };
      

// All precious Metals in Troy ounces
// XAU - Gold, XAG - Silver, XPD - Palladium, XPT - Platinum
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
      getCurrentRates,
      metalRates,
      currencyRates
    }
  }
}

</script>
