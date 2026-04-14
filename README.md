# LAB 02


[![Build and Test](https://github.com/SantCorrea802/Laboratorio_02_Arquitectura_Software/actions/workflows/build.yml/badge.svg)](https://github.com/SantCorrea802/Laboratorio_02_Arquitectura_Software/actions/workflows/build.yml)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=SantCorrea802_Laboratorio_02_Arquitectura_Software&metric=bugs)](https://sonarcloud.io/summary/new_code?id=SantCorrea802_Laboratorio_02_Arquitectura_Software)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=SantCorrea802_Laboratorio_02_Arquitectura_Software&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=SantCorrea802_Laboratorio_02_Arquitectura_Software)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=SantCorrea802_Laboratorio_02_Arquitectura_Software&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=SantCorrea802_Laboratorio_02_Arquitectura_Software)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=SantCorrea802_Laboratorio_02_Arquitectura_Software&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=SantCorrea802_Laboratorio_02_Arquitectura_Software)



# LABORATORIO 02 ARQUITECTURA DE SOFTWARE

El front de este proyecto se encuentra en:
[FRONT](https://bank-front-juv5.onrender.com)

para probar el docker image de manera local haga:
   ```bash

docker pull santcorrea/lab2_bank:latest


docker run --name bank_app -p 8080:8080 `
  -e PORT=8080 `
  -e SPRING_DATASOURCE_URL="jdbc:postgresql://host.docker.internal:5432/bank_lab01" `
  -e SPRING_DATASOURCE_USERNAME=postgres `
  -e SPRING_DATASOURCE_PASSWORD=TU_PASSWORD `
  santcorrea/lab2_bank:latest

   ```
