# ✦ STARBOY STREETWEAR - Achados Shein ✦

Website moderno estilo Y2K / Streetwear desenvolvido para apresentar os achados da Shein dos seguidores do Instagram **@starboy_brazil**.

---

## 🌟 Funcionalidades Principais

1. **Página Inicial (Feed 4:5)**:
   - Grade de fotos dos Looks no formato **4:5** (proporção idêntica ao Instagram).
   - Selos d'água "ACHADOS SHEIN" e estrela Y2K `✦` exatamente como nas postagens.
   - Barra de busca instantânea por número do Look (ex: `LOOK N#9`), nome do item ou código da Shein (ex: `NQF5PV7`).
   - Filtros por categoria (Streetwear, Masculino, Feminino, Dark, Acessórios).

2. **Página do Look (Peças & Links)**:
   - Exibição de 1 foto 4:5 para cada peça do look escolhido.
   - Badge com o código ID da Shein e botão de **Copiar Código em 1-clique**.
   - Botão principal **"ABRIR NA SHEIN ↗"** direcionando para o link de compra direto/afiliado.

3. **Painel de Administração (`/admin`)**:
   - Acesso por PIN/Senha (padrão: `starboy`).
   - Formulário para cadastrar novos looks (upload da capa 4:5 + título/número).
   - Adição dinâmica de peças com foto 4:5, ID e link da Shein.
   - Edição e exclusão de looks.
   - Exportação de dados em JSON para backup ou integração.

---

## 🚀 Como fazer o Deploy Gratuito na Vercel

O projeto foi configurado com `vercel.json` e Vite, pronto para publicação instantânea.

### Opção 1: Via Vercel Web Dashboard (Recomendado)
1. Suba esta pasta para um repositório no seu **GitHub** (ex: `starboy-achados`).
2. Acesse [vercel.com](https://vercel.com) e faça login.
3. Clique em **"Add New"** -> **"Project"**.
4. Importe o repositório do GitHub.
5. Em **Framework Preset**, selecione **Vite**.
6. Clique em **"Deploy"**. Seu site estará no ar em menos de 1 minuto com link `.vercel.app`!

### Opção 2: Via Vercel CLI (Direto no Terminal)
1. Abra o terminal nesta pasta (`starboy-achados`).
2. Instale a Vercel CLI (se ainda não tiver):
   ```bash
   npm i -g vercel
   ```
3. Execute o comando de deploy:
   ```bash
   vercel
   ```
4. Pressione Enter para confirmar as configurações padrão e o site será publicado!

---

## 🛠️ Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```

---
*Desenvolvido para @starboy_brazil - STARBOY STREETWEAR*
