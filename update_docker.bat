@echo off
echo Pulling latest image...
docker-compose pull
echo Restarting containers...
docker-compose up -d
echo Update complete!
pause
