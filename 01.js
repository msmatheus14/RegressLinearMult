// Matheus Andrade e Gabriel Alves

const fs = require('fs')
const xlsx = require('xlsx')

const DB = xlsx.readFile ('DataBase-AppleQuality.xlsx')

const DB3 = DB.Sheets['banana_quality']


let banana_tamanho = []
let banana_peso = []
let banana_docura = []
let banana_macies = []
let banana_tempoColheira = []
let banana_amadurecimento = []
let banana_acidez = []


//Variável dependente
let banana_qualidade = []

let varIndependente = []


// Faz leitura dos valores no excel e adiciona dentro dos vetores
for (const cellAdress in DB3){

        const valor = DB3[cellAdress].v
        
        if (cellAdress.startsWith('A')){
           
            banana_tamanho.push(valor)
        }
        else
        if (cellAdress.startsWith('B')){
           
            banana_peso.push(valor)
        }
        else
        if (cellAdress.startsWith('C')){
           
            banana_docura.push(valor)
        }
        else
        if (cellAdress.startsWith('D')){
           
            banana_macies.push(valor)
        }
        else
        if (cellAdress.startsWith('E')){
           
            banana_tempoColheira.push(valor)
        }
        else
        if (cellAdress.startsWith('F')){
           
            banana_amadurecimento.push(valor)
        }
        else
        if (cellAdress.startsWith('G')){
           
            banana_acidez.push(valor)
            
        }
        else
        if (cellAdress.startsWith('H')){
           
            banana_qualidade.push(valor)
        }
        
        

}


function calculaRegressaoLinearMultipla(){

}

function prepararDate()
{
    for( var i = 0; i<banana_tamanho.length;i++)
    {
        varIndependente.push([banana_tamanho[i], banana_peso[i], banana_docura[i], banana_macies[i], banana_tempoColheira[i], banana_amadurecimento[i], banana_acidez[i]])
    }
}

prepararDate()
console.log(varIndependente)