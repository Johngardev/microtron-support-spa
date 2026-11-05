#!/bin/bash

# Script de instalación y configuración rápida
# Uso: bash setup.sh

echo "🚀 Iniciando configuración del proyecto..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Instalar dependencias del backend
echo "📥 Instalando dependencias del backend..."
cd support-api
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del backend instaladas${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias del backend${NC}"
    exit 1
fi

# Instalar dependencias del frontend
echo "📥 Instalando dependencias del frontend..."
cd ../support-web
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias del frontend instaladas${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias del frontend${NC}"
    exit 1
fi

cd ..

# Crear .env si no existe
if [ ! -f "support-api/.env" ]; then
    echo "📝 Creando archivo .env..."
    cp support-api/.env.example support-api/.env
    echo -e "${YELLOW}⚠️  Por favor, actualiza el archivo support-api/.env con tus credenciales${NC}"
fi

echo ""
echo -e "${GREEN}✓ Configuración completada${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Backend:"
echo "   cd support-api"
echo "   npm run start:dev"
echo ""
echo "2. Frontend (en otra terminal):"
echo "   cd support-web"
echo "   npm start"
echo ""
echo "3. Visita http://localhost:4200"
echo ""
