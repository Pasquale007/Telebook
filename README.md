# Moderne App- und Webtechnologien

## Beschreibung
Das ist eine React-Typescript Applikation für das Modul Moderne-App- und Webtechnologien.

## Start
Die genutzen Technologien, die benötigt werden um dieses Programm zu starten sind:
- Node v16.15.0
### Frontend
Um die Developmentansicht zu starten muss im Order 'frontend' folgende Befehle eingegeben werden:
```
 npm install
 npm start
``` 
Damit ist das frontend gestarted.

### Datenbank
Um die Datenbank zu starten muss das Dockerfile mit folgendem Kommando im Ordner 'server' ausgeführt werden:
```
docker-compose up
```
> Wichtig: Man muss wartern bis die Datenbank hochgefahren ist, bevor man das Backend startet.

### Backend
Um das Backend script zu starten müssen folgende Befehle im Ordner 'backend' eingegeben werden:
```
npm install
node index
```
