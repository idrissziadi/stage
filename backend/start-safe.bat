@echo off
echo 🚀 Starting Education Management System Backend
echo.

echo 🔍 Checking if database needs reset...
node manage-database.js check

echo.
echo 🔌 Starting server...
echo If you see "Too many keys" error, run: node reset-database.js
echo.

npm run dev