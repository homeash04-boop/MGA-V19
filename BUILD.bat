@echo off
title School Portal V16 - Build
cd /d "%~dp0"
npm.cmd install
npm.cmd run build
pause
