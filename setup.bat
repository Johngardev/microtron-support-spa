@echo off
REM Script de instalación y configuración rápida para Windows
REM Uso: setup.bat

echo.
echo ======================================
echo  Instalación del Proyecto
echo ======================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado. Descargalo desde https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%
echo.

REM Verificar npm
echo Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no está instalado.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION%
echo.

REM Instalar dependencias del backend
echo Instalando dependencias del backend...
cd support-api
call npm install
if errorlevel 1 (
    echo [ERROR] Error al instalar dependencias del backend
    cd ..
    pause
    exit /b 1
)
echo [OK] Dependencias del backend instaladas
cd ..
echo.

REM Instalar dependencias del frontend
echo Instalando dependencias del frontend...
cd support-web
call npm install
if errorlevel 1 (
    echo [ERROR] Error al instalar dependencias del frontend
    cd ..
    pause
    exit /b 1
)
echo [OK] Dependencias del frontend instaladas
cd ..
echo.

REM Crear .env si no existe
if not exist "support-api\.env" (
    echo Creando archivo .env...
    copy support-api\.env.example support-api\.env
    echo [ADVERTENCIA] Por favor, actualiza support-api\.env con tus credenciales
    echo.
)

echo.
echo ======================================
echo  Configuración Completada
echo ======================================
echo.
echo Proximos pasos:
echo.
echo 1. Backend:
echo    cd support-api
echo    npm run start:dev
echo.
echo 2. Frontend (en otra terminal):
echo    cd support-web
echo    npm start
echo.
echo 3. Visita http://localhost:4200
echo.
pause
