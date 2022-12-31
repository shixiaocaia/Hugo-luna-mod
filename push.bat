git add .
set /p m= input commit = 
git commit -m %m%
git push origin main
pause