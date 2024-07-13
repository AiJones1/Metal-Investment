<template>
    <div>
        <v-carousel >There will be something here I swear</v-carousel>

        <v-row>
            <v-col>
                Metal Invested
                <v-select
                v-model="metalSelect"
                :items="metalOpts"></v-select>
            </v-col>
            <v-col>
                Amount
            </v-col>
            <v-col>
                Date
            </v-col>
            <v-col>
                Currency
            </v-col>

        </v-row>
        
        <v-btn>Calculate profit</v-btn>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue'

let metalSelect = ref('Silver')

const metalOpts =[
    { title: 'Gold', value:'XAU'},
    { title:'Silver', value:'XAG'},
    { title:'Platinum', value:'XPT'},
    { title:'Paladium', value:'XPD'},
]
//Adjust options to standard conventions, just put down base line main options
const amountOpts = ([
    'Troy Ounce', 'Kilogram', 'Tonne'
])


//functions
function convertToOunces(input){
    // Take in option and output conversion
    if(input==='Troy Ounce'){
        return input;
    }
}

</script>