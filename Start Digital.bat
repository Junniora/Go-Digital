@echo off
title Go Digital Portal - Starting...
echo ============================================
echo    Go Digital Portal - Iniciando servicios
echo ============================================
echo.

:: Start Backend API in background
echo [1/2] Iniciando Backend API (puerto 5044)...
start /B cmd /c "cd /d %~dp0GoDigital.API && dotnet run --urls http://localhost:5044 > nul 2>&1"
timeout /t 5 /nobreak > nul

:: Start Frontend
echo [2/2] Iniciando Frontend (puerto 9000)...
start /B cmd /c "cd /d %~dp0go-digital-frontend && npx quasar dev > nul 2>&1"
timeout /t 8 /nobreak > nul

echo.
echo ============================================
echo    Go Digital Portal esta listo!
echo    Abre: http://localhost:9000
echo ============================================
echo.
echo Cuentas de acceso:
echo   admin@godigital.com / admin123  (Admin)
echo   dx@godigital.com / dx123        (Equipo DX)
echo   user@godigital.com / user123    (Usuario)
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause > nul

start http://localhost:9000

echo.
echo (No cierres esta ventana mientras uses la app)
echo Presiona Ctrl+C para detener los servicios.
pause > nul
