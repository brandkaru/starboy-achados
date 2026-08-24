# 🚀 STARBOY STREETWEAR - Servidor Cloud DB para VPS Oracle

Instruções simples de 2 minutos para rodar o banco de dados na sua VPS Oracle:

## 1. Entre no terminal da sua VPS Oracle
```bash
cd ~
git clone https://github.com/brandkaru/starboy-achados.git
cd starboy-achados/vps-backend
npm install
```

## 2. Iniciar o Servidor em segundo plano com PM2
```bash
npx pm2 start server.js --name "starboy-api"
npx pm2 save
```

## 3. Liberar a porta 3001 no firewall da VPS (se necessário)
```bash
sudo ufw allow 3001/tcp
```

Pronto! Seu servidor estará rodando em: `http://SEU_IP_DA_VPS:3001`
Cole essa URL na configuração do Painel ADM do site para sincronizar 100% em tempo real! 🌐✨
