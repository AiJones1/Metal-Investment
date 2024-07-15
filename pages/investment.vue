<template>
    <div>
        <v-carousel >
            <v-carousel-item 
            src="../gold.jpg"
            />
            <v-carousel-item 
            src="../stonks.jpeg"
            />
        </v-carousel>


        <v-row>
            <v-col>
                
                <v-select
                v-model="metalSelect"
                :items="metalOpts"
                label="Specify Metal"></v-select>
            </v-col>
            
            <v-col>
                Date
            </v-col>
            <v-col>
                Amount:
                <v-text-field label="Type Here"></v-text-field>     
            </v-col>
            <v-col>
                <v-select
                v-model="weightSelect"
                label="weight units"
                :items="weightOpts"></v-select>
            </v-col>
            <v-col>
                <v-btn>
                    Add Investment
                </v-btn>
            </v-col>
        </v-row>
        <p align="right">Curent silver: </p>
        <p align="right">Current Total: $</p>
        
        <v-btn>Calculate profit</v-btn>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue'

let metalSelect = ref('Silver')
let weightSelect = ref('Troy Ounce')

const metalOpts =[
    { title: 'Gold', value:'XAU'},
    { title:'Silver', value:'XAG'},
    { title:'Platinum', value:'XPT'},
    { title:'Paladium', value:'XPD'},
]
//Adjust options to standard conventions, just put down base line main options
const weightOpts = ([
    'Troy Ounce', 'Kilogram', 'Carat', 'Gram'
])

// Carat
// Gram
// Troy Ounce
// Kilogram


//functions
function convertToOunces(input){
    // Take in option and output conversion
    if(input==='Troy Ounce'){
        return input;
    }
}

</script>