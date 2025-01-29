# Usar uma imagem oficial do Node.js como base
FROM node:22-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do projeto para dentro do container
COPY . .

# Instalar dependências
RUN yarn install

# Compilar o código do NestJS
RUN yarn build


# Expôr a porta que o aplicativo irá rodar
EXPOSE 3000

# Definir o comando para rodar a aplicação
CMD ["yarn", "start:prod"]

# Instalar o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Adicionando node_modules/.bin ao PATH
ENV PATH="./node_modules/.bin:$PATH"
