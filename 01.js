// Matheus Andrade e Gabriel Alves
const MLR = require("ml-regression-multivariate-linear");
const fs = require('fs')
const xlsx = require('xlsx');
const { type } = require("os");

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

    for (var i; i < banana_acidez.length; i++)
    {
        banana_tamanho[i] = JSON.parse(JSON.stringify(banana_tamanho[i]))
        banana_peso[i] = JSON.parse(JSON.stringify(banana_peso[i]))
        banana_docura[i] = JSON.parse(JSON.stringify(banana_docura[i]))
        banana_macies[i] = JSON.parse(JSON.stringify(banana_macies[i]))
        banana_tempoColheira[i] = JSON.parse(JSON.stringify(banana_tempoColheira[i]))
        banana_amadurecimento[i] = JSON.parse(JSON.stringify(banana_amadurecimento[i]))
        banana_acidez[i] = JSON.parse(JSON.stringify(banana_acidez[i]))
    
        banana_qualidade[i] = Json.parse(JSON.stringify(banana_qualidade[i]))
    
        varIndependente.push([banana_tamanho[i], banana_peso[i], banana_docura[i], banana_macies[i], banana_tempoColheira[i], banana_amadurecimento[i], banana_acidez[i]])
    }

   
}


prepararDate()



console.log(banana_qualidade)

const mlr = new MLR(varIndependente, banana_qualidade);

const newInput = [-1.9249682, 46807805, 30778325, -14721768, 2947986, 24355695, 27129033];
const predictedOutput = mlr.predict(newInput);
console.log(`Previsão: ${predictedOutput}`);


console.log('Coeficientes:', coeficientes);
