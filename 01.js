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


let provaReal = []

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

function Acuracia(){
    let igual = 0
    let diferent = 0

    for (let i = 0; i<banana_qualidade.length;i++){


        provaReal.push(calcularPrevisao(banana_tamanho[i],banana_peso[i],banana_docura[i],banana_macies[i],banana_tempoColheira[i],banana_amadurecimento[i],banana_acidez[i]))

    }
    for (let i = 0; i<banana_qualidade.length;i++){


        if(banana_qualidade[i] == classificarValor(provaReal[i]))
        {   

            igual += 1
        }
        else
        {
            diferent += 1

        }


       

    }

    console.log('Acurácia:', (igual/provaReal.length)*100,"%")
    console.log(`Igual:${igual}, Diferente: ${diferent}`)
}

  function classificarValor(valorPrevisto) {
    if (valorPrevisto >= 0.50 && valorPrevisto <= 1.50) {
        return 1;
    } else {
        return 0;
    }
}

Acuracia()


function calcularCoeficienteDeterminacao(y_true, y_pred) {
    const n = y_true.length;

    // Calcular a média dos valores reais
    const mean_y_true = y_true.reduce((acc, curr) => acc + curr, 0) / n;

    // Calcular a soma dos quadrados totais (SST)
    const sst = y_true.reduce((acc, curr) => acc + Math.pow(curr - mean_y_true, 2), 0);

    // Calcular a soma dos quadrados dos resíduos (SSE)
    const sse = y_true.reduce((acc, curr, i) => acc + Math.pow(curr - y_pred[i], 2), 0);

    // Calcular o coeficiente de determinação (R²)
    const r_squared = 1 - (sse / sst);

    return r_squared;
}

// Calcular os valores previstos para a base de dados
let predicoes = [];
for (let i = 0; i < banana_qualidade.length; i++) {
    predicoes.push(calcularPrevisao(banana_tamanho[i], banana_peso[i], banana_docura[i], banana_macies[i], banana_tempoColheira[i], banana_amadurecimento[i], banana_acidez[i]));
}

// Calcular o coeficiente de determinação
const r_squared = calcularCoeficienteDeterminacao(banana_qualidade, predicoes);
console.log('Coeficiente de Determinação (R²):', r_squared);


function calcularMSE(y_true, y_pred) {

    const n = y_true.length;
    let mse = 0;

    // Calcula o quadrado da diferença entre cada valor previsto e real
    for (let i = 0; i < n; i++) {
        mse += Math.pow(y_true[i] - y_pred[i], 2);
    }

    // Divide pela quantidade total de observações
    mse /= n;

    return mse;
}

let predicoes2 = [];

for (let i = 0; i < banana_qualidade.length; i++) {
    predicoes2.push(calcularPrevisao(banana_tamanho[i], banana_peso[i], banana_docura[i], banana_macies[i], banana_tempoColheira[i], banana_amadurecimento[i], banana_acidez[i]));
}

const MSE = calcularMSE(banana_qualidade, predicoes2 )




console.log("Erro Quadrático Médio:",MSE.toFixed(2))

function calcularEstatisticaF(y_true, y_pred, k) {
    const n = y_true.length;
    const p = k + 1; // Número de variáveis independentes mais o termo de interceptação

    // Calcular a soma dos quadrados dos resíduos (SSE)
    const sse = y_true.reduce((acc, curr, i) => acc + Math.pow(curr - y_pred[i], 2), 0);

    // Calcular o quadrado médio do erro (MSE)
    const mse = sse / (n - p);

    // Calcular a soma dos quadrados totais (SST)
    const mean_y_true = y_true.reduce((acc, curr) => acc + curr, 0) / n;
    const sst = y_true.reduce((acc, curr) => acc + Math.pow(curr - mean_y_true, 2), 0);

    // Calcular a estatística F
    const f_statistic = (sst / p) / mse;

    return f_statistic;
}


const estatisticaF = calcularEstatisticaF(banana_qualidade, predicoes, varIndependente[0].length);

console.log('Estatística F:', estatisticaF);


