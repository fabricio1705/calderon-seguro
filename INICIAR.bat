@echo off
chcp 65001 >nul
title Calderón Seguro - Servidor de desarrollo
cd /d "%~dp0"

echo ==============================================
echo   Calderón Seguro - Prototipo de demostración
echo ==============================================
echo.

rem 1. Comprobar que Node.js y npm estén instalados
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontró Node.js.
  echo Descárgalo e instálalo desde https://nodejs.org ^(versión LTS^)
  echo y vuelve a ejecutar este archivo.
  echo.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontró npm. Reinstala Node.js desde https://nodejs.org
  echo.
  pause
  exit /b 1
)

rem 2. Comprobar que las dependencias estén instaladas
if not exist "node_modules\@angular\cli" (
  echo Las dependencias del proyecto no están instaladas.
  echo Para instalarlas se ejecuta el comando:  npm install
  echo.
  choice /c SN /m "¿Quieres instalarlas ahora"
  if errorlevel 2 (
    echo.
    echo Ejecuta "npm install" en esta carpeta y vuelve a abrir INICIAR.bat.
    echo.
    pause
    exit /b 1
  )
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] No se pudieron instalar las dependencias.
    echo Revisa tu conexión a internet y vuelve a intentarlo.
    echo.
    pause
    exit /b 1
  )
)

rem 3. Abrir Google Chrome cuando el servidor esté listo (espera hasta 3 minutos)
start "" /min powershell -NoProfile -WindowStyle Hidden -Command ^
  "$listo = $false; for ($i = 0; $i -lt 90 -and -not $listo; $i++) { try { $c = New-Object Net.Sockets.TcpClient('localhost', 4200); $c.Close(); $listo = $true } catch { Start-Sleep 2 } };" ^
  "if ($listo) { try { Start-Process chrome 'http://localhost:4200' } catch { Start-Process 'http://localhost:4200' } }"

rem 4. Iniciar Angular
echo.
echo Iniciando Angular... La aplicación se abrirá en Chrome en http://localhost:4200
echo No cierres esta ventana mientras uses el prototipo. Para detenerlo pulsa Ctrl+C.
echo.
call npm start

echo.
echo El servidor se detuvo.
echo Si apareció un error de memoria ("out of memory"), cierra otros programas
echo o reinicia la computadora y vuelve a abrir INICIAR.bat.
echo.
pause
