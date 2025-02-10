# Použití oficiálního Node.js image
FROM node:18-alpine

# Nastavení pracovního adresáře v kontejneru
WORKDIR /pages

# Kopírování package.json a package-lock.json
COPY package.json package-lock.json ./

# Instalace závislostí
RUN npm install

# Kopírování celého projektu
COPY . .

# Exponování portu 3000
EXPOSE 3000

# Spuštění aplikace
CMD ["npm", "run", "dev"]