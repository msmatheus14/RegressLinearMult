// Matheus Andrade e Gabriel Alves
const MLR = require("ml-regression-multivariate-linear");
const numeric = require('numeric')

const fs = require('fs')
const xlsx = require('xlsx');
const { type } = require("os");

const DB = xlsx.readFile('D:\\Matheus\\Estudos\\TADS\\3° Semestre\\Inteligência Artificial\\Regressão Linear Mutipla\\DataSet\\DataBase-AppleQuality.xlsx')

const DB3 = DB.Sheets['banana_quality']

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


// Calcular a regressão linear múltipla
const coeficientes = calcularRegressaoLinearMultipla(varIndependente, banana_qualidade);

console.log(coeficientes)


