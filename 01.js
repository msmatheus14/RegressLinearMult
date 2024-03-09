const numeric = require('numeric')
const xlsx = require('xlsx');

const DB = xlsx.readFile('./DataSet/DataBase-AppleQuality.xlsx')
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

function prepararData() {
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

prepararData()

function calcularRegressaoLinearMultipla(varIndependente, varDependente) {
    const n = varIndependente.length;
    const k = varIndependente[0].length;

    const X = varIndependente.map(row => [1, ...row]);

    const XT = [];
    for (let j = 0; j < k + 1; j++) {
        XT.push(X.map(row => row[j]));
    }

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

    const XTXInv = numeric.inv(XTX);

    const XTY = [];
    for (let i = 0; i < k + 1; i++) {
        let sum = 0;
        for (let t = 0; t < n; t++) {
            sum += XT[i][t] * varDependente[t];
        }
        XTY.push(sum);
    }

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

console.log(coeficientes)

function preverValor(independentes) {
    if (independentes.length !== coeficientes.length - 1) {
      throw new Error('Número incorreto de variáveis independentes fornecidas.');
    }
  
    let valorPrevisto = coeficientes[0];
    for (let i = 0; i < independentes.length; i++) {
      valorPrevisto += independentes[i] * coeficientes[i + 1];
    }
  
    return valorPrevisto;
}

function classificarValor(valorPrevisto) {
    if (valorPrevisto >= 0.50 && valorPrevisto <= 1.50) {
        return 1;
    } else {
        return 0;
    }
}

const novasIndependentes = [-2.6608794, -20446665, 15902641, 14997064, -15818563, -16058589, 14356443];
const valorPrevisto = preverValor(novasIndependentes);
console.log(`Valor previsto: ${valorPrevisto}`);

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

console.log(`Taxa de acerto: ${(taxaAcerto * 100).toFixed(2)}%`);
