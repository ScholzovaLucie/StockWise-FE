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

# Spuštění aplikace s navýšeným heap limitem (4 GB)
CMD ["node", "--max-old-space-size=4096", "node_modules/.bin/next", "dev"]