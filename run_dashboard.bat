@echo off
echo Building E-Bus Cyber Dashboard...
call npm run build
echo.
echo Dashboard build complete. Starting local server...
echo.
echo Please open your browser and navigate to: http://localhost:3000
echo Press F11 in your browser for Full Screen mode.
echo.
npx serve -s dist -l 3000
pause
