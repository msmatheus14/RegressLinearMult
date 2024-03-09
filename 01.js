// Matheus Andrade e Gabriel Alves
const MLR = require("ml-regression-multivariate-linear");
const numeric = require('numeric')

const fs = require('fs')
const xlsx = require('xlsx');
const { type } = require("os");

const DB = xlsx.readFile('DataBase-AppleQuality.xlsx')

const DB3 = DB.Sheets['main']


let banana_tamanho = []
let banana_peso = []
let banana_docura = []
let banana_macies = []
let banana_tempoColheira = []
let banana_amadurecimento = []
let banana_acidez = []
let banana_qualidade = []

let varIndependente = []

for (const cellAdress in DB3) {
    const valor = DB3[cellAdress].v
    if (cellAdress.startsWith('A')) banana_tamanho.push(valor)
    else if (cellAdress.startsWith('B')) banana_peso.push(valor)
    else if (cellAdress.startsWith('C')) banana_docura.push(valor)
    else if (cellAdress.startsWith('D')) banana_macies.push(valor)
    else if (cellAdress.startsWith('E')) banana_tempoColheira.push(valor)
    else if (cellAdress.startsWith('F')) banana_amadurecimento.push(valor)
    else if (cellAdress.startsWith('G')) banana_acidez.push(valor)
    else if (cellAdress.startsWith('H')) banana_qualidade.push(valor)
}

function prepararDate() {
    for (let i = 0; i < banana_acidez.length; i++) {
        
        banana_tamanho[i] = JSON.parse(JSON.stringify(banana_tamanho[i]))
        banana_peso[i] = JSON.parse(JSON.stringify(banana_peso[i]))
        banana_docura[i] = JSON.parse(JSON.stringify(banana_docura[i]))
        banana_macies[i] = JSON.parse(JSON.stringify(banana_macies[i]))
        banana_tempoColheira[i] = JSON.parse(JSON.stringify(banana_tempoColheira[i]))
        banana_amadurecimento[i] = JSON.parse(JSON.stringify(banana_amadurecimento[i]))
        banana_acidez[i] = JSON.parse(JSON.stringify(banana_acidez[i]))

        banana_qualidade[i] = JSON.parse(JSON.stringify(banana_qualidade[i]))

        varIndependente.push([
            banana_tamanho[i],
            banana_peso[i],
            banana_docura[i],
            banana_macies[i],
            banana_tempoColheira[i],
            banana_amadurecimento[i],
            banana_acidez[i]
        ])
    }
}

prepararDate()

function calcularRegressaoLinearMultipla(varIndependente, varDependente) {
    const n = varIndependente.length;
    const k = varIndependente[0].length;

    // Adicionar uma coluna de 1s para representar o termo de intercepção
    const X = varIndependente.map(row => [1, ...row]);

    // Calcular a transposta de X
    const XT = [];
    for (let j = 0; j < k + 1; j++) {
        XT.push(X.map(row => row[j]));
    }

    // Calcular XT * X
    const XTX = [];
    for (let i = 0; i < k + 1; i++) {
        const row = [];
        for (let j = 0; j < k + 1; j++) {
            let sum = 0;
            for (let t = 0; t < n; t++) {
                sum += XT[i][t] * X[t][j];
            }
            row.push(sum);
        }
        XTX.push(row);
    }

    // Calcular a inversa de XT * X
    const XTXInv = numeric.inv(XTX);

    // Calcular XT * Y
    const XTY = [];
    for (let i = 0; i < k + 1; i++) {
        let sum = 0;
        for (let t = 0; t < n; t++) {
            sum += XT[i][t] * varDependente[t];
        }
        XTY.push(sum);
    }

    // Calcular os coeficientes beta
    const beta = [];
    for (let i = 0; i < k + 1; i++) {
        let sum = 0;
        for (let j = 0; j < k + 1; j++) {
            sum += XTXInv[i][j] * XTY[j];
        }
        beta.push(sum);
    }

    return beta;
}



const coeficientes = calcularRegressaoLinearMultipla(varIndependente, banana_qualidade);

console.log('Coeficientes: ',coeficientes)


function calcularPrevisao(tamanho, peso, docura, maciez, tempoColheita, amadurecimento, acidez) {
    // Calcula a previsão usando os coeficientes calculados
    const previsao = coeficientes[0] + 
                     coeficientes[1] * tamanho + 
                     coeficientes[2] * peso + 
                     coeficientes[3] * docura + 
                     coeficientes[4] * maciez + 
                     coeficientes[5] * tempoColheita + 
                     coeficientes[6] * amadurecimento + 
                     coeficientes[7] * acidez;

    return previsao;
}



console.log(`Qualidade prevista da maça baseada em suas características(Quanto mais perto de 1 melhor): ${(n1).toFixed(2)}`);
  

  function classificarValor(valorPrevisto) {
    if (valorPrevisto >= 0.50 && valorPrevisto <= 1.50) {
        return 1;
    } else {
        return 0;
    }
}


function determinarValor(){

}

const valoresClassificados = varIndependente.map((vars, index) => {
    const valorPrevisto = coeficientes[0] + vars.reduce((acc, cur, i) => acc + cur * coeficientes[i + 1], 0);
    return {
        previsto: valorPrevisto,
        classificado: classificarValor(valorPrevisto),
        real: banana_qualidade[index]
    };
});


const acertos = valoresClassificados.filter(item => item.classificado === item.real);
const taxaAcerto = acertos.length / valoresClassificados.length;

console.log(`Taxa de acerto da aplicação: ${(taxaAcerto * 100).toFixed(2)}%`)



