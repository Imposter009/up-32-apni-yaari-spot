@echo off
title Apni Yaari Spot - Local Server
cd /d "%~dp0"
echo.
echo  Apni Yaari Spot - starting local server...
echo  Open http://localhost:8080 in your browser
echo  Press Ctrl+C to stop
echo.

where py >nul 2>&1 && (
  start http://localhost:8080
  py -m http.server 8080
  goto :done
)

where python >nul 2>&1 && (
  start http://localhost:8080
  python -m http.server 8080
  goto :done
)

where node >nul 2>&1 && (
  start http://localhost:8080
  npx --yes serve -l 8080 .
  goto :done
)

start http://localhost:8080
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
goto :done

:done
