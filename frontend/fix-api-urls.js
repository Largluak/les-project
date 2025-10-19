// Script para corrigir URLs da API em todos os arquivos
const fs = require("fs");
const path = require("path");

const frontendDir = __dirname;
const jsDir = path.join(frontendDir, "js");

// Lista de arquivos para atualizar
const filesToUpdate = ["products.js", "orders.js", "cart.js", "checkout.js"];

// Função para substituir URLs
function updateApiUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Substituir URLs relativas por URLs absolutas
    content = content.replace(
      /fetch\(`\/api\//g,
      "fetch(`${API_CONFIG.BASE_URL}/"
    );
    content = content.replace(
      /fetch\("\/api\//g,
      "fetch(`${API_CONFIG.BASE_URL}/"
    );
    content = content.replace(
      /fetch\('\/api\//g,
      "fetch(`${API_CONFIG.BASE_URL}/"
    );

    // Adicionar import da configuração se não existir
    if (!content.includes("API_CONFIG")) {
      content = "// Configuração da API\n" + content;
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Atualizado: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error.message);
  }
}

// Atualizar todos os arquivos
console.log("🔧 Corrigindo URLs da API...\n");

filesToUpdate.forEach((file) => {
  const filePath = path.join(jsDir, file);
  if (fs.existsSync(filePath)) {
    updateApiUrls(filePath);
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${file}`);
  }
});

console.log("\n✅ URLs da API corrigidas!");
console.log("📝 Agora o frontend usará a configuração correta da API");









