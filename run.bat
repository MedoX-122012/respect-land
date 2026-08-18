@echo off
setlocal EnableExtensions
title Respect Land
cd /d "%~dp0"

echo.
echo  ============================================
echo    Respect Land - launcher
echo  ============================================
echo.

set "NODE_EXE="
where node >nul 2>nul
if %errorlevel%==0 set "NODE_EXE=node"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%ProgramFiles(x86)%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"

if not defined NODE_EXE (
    echo.
    echo  [ERROR] Node.js was not found.
    echo  Install it from https://nodejs.org then run this file again.
    echo  Make sure "Add to PATH" is checked during installation.
    echo.
    pause
    exit /b 1
)

if not exist ".env" (
    if exist ".env.example" (
        echo  .env not found - creating it from .env.example
        copy /y ".env.example" ".env" >nul
    ) else (
        echo.
        echo  [ERROR] Missing .env.example
        echo.
        pause
        exit /b 1
    )
)

if not exist "node_modules" (
    echo  [1/3] Installing packages... only on first run
    call npm install --no-audit --no-fund --loglevel=error
    if errorlevel 1 goto :fail
)

if not exist "prisma\dev.db" (
    echo  [2/3] Preparing the database...
    call npx prisma db push
    if errorlevel 1 goto :fail
    echo  [2/3] Seeding demo data...
    call npm run db:seed
    if errorlevel 1 goto :fail
)

echo  [3/3] Starting the site...
echo.
echo  Open your browser at:   http://localhost:3000
echo  Admin login:            admin@respect.land / admin123
echo  (Close this window to stop the server)
echo.

if exist ".next\dev\cache" rmdir /s /q ".next\dev\cache" >nul 2>nul

start "" http://localhost:3000
call npm run dev

goto :eof

:fail
echo.
echo  [ERROR] Something went wrong. Read the output above.
pause
exit /b 1