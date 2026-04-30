@echo off
title School Portal V16 - Run Local
cd /d "%~dp0"
if not exist node_modules (
  echo Installing packages...
  npm.cmd install
)
npm.cmd run dev
pause
