// Este script transforma todas as imagens PNG da pasta e as transforma em
// 1. Converte quaisquer imagens PNG extraídas para o formato SVG usando o Inkscape e exclui os arquivos PNG originais após a conversão.
// 2. Registra os processos de conversão e exclusão no console.
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define o diretório de saída
const outputDir = "/home/capitolio/Code/foco-total-visuais/INEP/2024/Regular";

// Certifique-se de que o diretório de saída existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Obtenha todos os arquivos PNG do diretório de saída
fs.readdir(outputDir, (err, files) => {
    if (err) {
        console.error(`Erro ao ler o diretório: ${err.message}`);
        return;
    }

    // Filtre apenas arquivos PNG
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

    pngFiles.forEach(file => {
        const filePath = path.join(outputDir, file);
        const svgFilePath = filePath.replace(/\.png$/i, '.svg');

        // Converta PNG para SVG usando o Inkscape
        const inkscapeCommand = `unshare --user inkscape "${filePath}" --export-type=svg --export-filename="${svgFilePath}"`;

        exec(inkscapeCommand, (convError) => {
            if (convError) {
                console.error(`Erro ao converter PNG para SVG: ${convError.message}`);
                return;
            }
            console.log(`Convertido: ${file} -> ${path.basename(svgFilePath)}`);
            
            // Exclua o PNG original após a conversão
            fs.unlink(filePath, (delError) => {
                if (delError) {
                    console.error(`Erro ao excluir o arquivo PNG: ${delError.message}`);
                    return;
                }
                console.log(`Excluído: ${file}`);
            });
        });
    });
});