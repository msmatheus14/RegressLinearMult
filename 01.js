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

while(0 <2)
{
    
}

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

function validarReal(){
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

    console.log('Taxa de Acerto:', (igual/provaReal.length)*100,"%")
    console.log(`Igual:${igual}, Diferente: ${diferent}`)
}

  function classificarValor(valorPrevisto) {
    if (valorPrevisto >= 0.50 && valorPrevisto <= 1.50) {
        return 1;
    } else {
        return 0;
    }
}




// Função para calcular o coeficiente de determinação R²
function calcularR2(previsoes, observados) {
    const mediaObservados = observados.reduce((acc, curr) => acc + curr, 0) / observados.length;
    const sst = observados.reduce((acc, curr) => acc + Math.pow(curr - mediaObservados, 2), 0);
    const sse = previsoes.reduce((acc, curr, index) => acc + Math.pow(curr - observados[index], 2), 0);
    const r2 = 1 - (sse / sst);
    return r2;
}

// Função para calcular o erro médio quadrático (MSE)
function calcularMSE(previsoes, observados) {
    const mse = observados.reduce((acc, curr, index) => acc + Math.pow(curr - previsoes[index], 2), 0) / observados.length;
    return mse;
}

// Função para calcular a estatística F
function calcularEstatisticaF(previsoes, observados, k) {
    const sst = observados.reduce((acc, curr) => acc + Math.pow(curr - observados.reduce((acc, curr) => acc + curr, 0) / observados.length, 2), 0);
    const sse = previsoes.reduce((acc, curr, index) => acc + Math.pow(curr - observados[index], 2), 0);
    const f = ((sst - sse) / k) / (sse / (observados.length - k - 1));
    return f;
}

// Função para calcular o valor p
function calcularValorP(estatisticaF, k, n) {
    const pValue = 1 - numeric.centralF.cdf(estatisticaF, k, n - k - 1);
    return pValue;
}

// Função para avaliar o modelo usando as métricas R², MSE, estatística F e valor p
function avaliarModelo(previsoes, observados, k) {
    const r2 = calcularR2(previsoes, observados);
    const mse = calcularMSE(previsoes, observados);
    const estatisticaF = calcularEstatisticaF(previsoes, observados, k);
    const pValue = calcularValorP(estatisticaF, k, observados.length);
    return { r2, mse, estatisticaF, pValue };
}

// Função para validar as previsões do modelo
function validarPrevisoes(previsoes, observados) {
    let igual = 0;
    let diferente = 0;

    for (let i = 0; i < previsoes.length; i++) {
        if (previsoes[i] === observados[i]) {
            igual++;
        } else {
            diferente++;
        }
    }

    const taxaAcerto = (igual / (igual + diferente)) * 100;
    return { igual, diferente, taxaAcerto };
}

// Avaliar o modelo usando as métricas
const avaliacao = avaliarModelo(previsoes, banana_qualidade, 7);
console.log('Avaliação do Modelo:');
console.log('R²:', avaliacao.r2);
console.log('MSE:', avaliacao.mse);
console.log('Estatística F:', avaliacao.estatisticaF);
console.log('Valor p:', avaliacao.pValue);

// Validar as previsões do modelo
const validacaoPrevisoes = validarPrevisoes(previsoes, banana_qualidade);
console.log('Validação das Previsões:');
console.log('Igual:', validacaoPrevisoes.igual);
console.log('Diferente:', validacaoPrevisoes.diferente);
console.log('Taxa de Acerto:', validacaoPrevisoes.taxaAcerto, '%');
