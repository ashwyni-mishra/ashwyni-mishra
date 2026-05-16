@echo off
echo Cleaning corrupted node_modules and lockfiles...
rmdir /s /q node_modules
del /q package-lock.json
echo Reinstalling dependencies cleanly...
npm install
echo Finished! You can now run "npm run dev".
pause
