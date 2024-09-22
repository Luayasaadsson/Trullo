# Trullo

## Introduktion

Det här är en applikation för hantering av uppgifter och projekt byggt med __Node.js__, __Express.js__, __GraphQL__ och __MongoDB__. Applikationen möjliggör för användare att skapa och hantera projekt samt tilldela och följa upp uppgifter inom dessa projekt.

Applikationen har två olika användarroller:

- **Admin**: Har fullständig kontroll över användarhantering, projekt och uppgifter. Administratörer kan skapa, redigera och ta bort både användare, projekt och uppgifter.

 - **Användare**: Kan skapa, uppdatera och hantera sina tilldelade projekt och uppgifter men har inte rättigheter att hantera andra användare.

__Autentisering sker via JWT (JSON Web Tokens)__: Applikationen använder JWT för autentisering, vilket säkerställer att endast auktoriserade användare kan komma åt skyddade rutter och funktioner. Detta bidrar till säker hantering av användarsessioner och åtkomstkontroll.

## Motivera ditt val av databas

Jag valde att använda MongoDB, en NoSQL-databas, eftersom den erbjuder flexibilitet och enkelhet i datamodellering, särskilt för en projekthanteringsapplikation som Trullo. Här är de främsta skälen:

- **Flexibilitet:**:
MongoDB schemalösa natur gör det lätt att anpassa datamodellen utan att behöva göra stora migreringar. Det passar väl i ett projekt där strukturen kan behöva justeras under utvecklingen.

- **Dokumentbaserad modell**:
 Applikationen består av objekt som _User_, _Task_ och _Project_, och varje _Task_ hör till ett _Project_ och kan tilldelas en _User_. MongoDB
dokumentbaserade modell låter mig enkelt koppla dessa objekt till varandra via referenser _(ObjectId)_.

- **Skalbarhet**:
MongoDB är designat för att hantera stora datamängder och kan enkelt skalas horisontellt vid behov, vilket gör den lämplig för applikationer med potential att växa.

- **JSON-struktur**:
Eftersom MongoDB lagrar data som JSON-liknande dokument, integrerar det smidigt med JavaScript/TypeScript-baserade applikationer som denna.

## Redogör för vad de olika teknikerna (verktyg, npm-paket, etc.) gör i applikationen

- **Node.js**:
Node.js är den runtime-miljö som används för att köra serverkoden. Det låter mig köra JavaScript på serversidan och hantera asynkron programmering effektivt.

- **Express.js**:
Express är ett minimalistiskt ramverk som används för att bygga API. Det hanterar HTTP-förfrågningar och routing och fungerar som grunden för GraphQL-servern.

- **TypeScript**:
TypeScript lägger till statisk typning ovanpå JavaScript, vilket hjälper till att upptäcka och förhindra fel tidigt under utvecklingen. Det ger också bättre kodstruktur och underhållbarhet.

- **Mongoose**:
Mongoose är ett ODM (Object-Document Modeling)-bibliotek som används för att hantera interaktionen med MongoDB. Det tillhandahåller ett schema-baserat sätt att definiera data och validera datainmatningar.

- **GraphQL**:
GraphQL används för att bygga API. Istället för REST, där varje resurs har sin egen endpoint, ger GraphQL ett mer flexibelt sätt att hämta och manipulera data genom en enda endpoint. Det gör det möjligt att specificera exakt vilka fält man vill ha i en fråga, vilket minskar datatransfer.

- **JWT (jsonwebtoken)**:
JWT används för autentisering. När en användare loggar in genereras en token som används för att verifiera användarens identitet i efterföljande förfrågningar.

- **Bcrypt**:
Bcrypt används för att hasha och salta lösenord innan de lagras i databasen, vilket säkerställer att lösenorden lagras på ett säkert sätt.

- **Crypto**:
Crypto används för att generera unika tokens, exempelvis för lösenordsåterställning. Genom att använda kryptografiska funktioner från detta bibliotek kan jag skapa säkra återställningstokens.

- **Nodemon**:
Nodemon är ett utvecklingsberoende verktyg som övervakar filändringar i projektet och startar automatiskt om servern när en fil ändras, vilket förbättrar utvecklingsflödet.

- **Dotenv**:
Dotenv används för att hantera miljövariabler på ett säkert sätt. Det gör det möjligt att hålla känsliga uppgifter som t.ex. databas-URL och JWT-hemlighet utanför koden och i en säker .env-fil.

## Redogör översiktligt hur applikationen fungerar

### Struktur:

Applikationen är strukturerad kring tre huvudmodeller: User, Task och Project. Varje User kan tilldelas en Task, och varje Task är associerad med ett Project. Applikationen hanterar grundläggande CRUD-operationer (Create, Read, Update, Delete) för både Tasks och Users, samt projektbaserad organisation.

### Funktioner:

- **Användarhantering**:
Applikationen hanterar användare genom att låta administratörer skapa, läsa, uppdatera och ta bort användare. Endast inloggade administratörer kan göra detta.

- **Uppgiftshantering**:
Varje användare kan skapa, uppdatera och ta bort Tasks. Tasks har ett statusfält som anger om de är i "Todo", "In Progress" eller "Completed", och de kan tilldelas en specifik användare.

- **Projekthantering**:
Flera Tasks kan tillhöra ett specifikt Project, vilket gör att uppgifter kan organiseras och hanteras inom projektgrupper.

### Autentisering och auktorisering:

- **Autentisering**:
Det sker via JWT (JSON Web Tokens). Varje användare som loggar in får en token som krävs för att få tillgång till skyddade endpoints.

- **Rollhantering**:
Är implementerat via ett role-fält på användarobjekten, vilket gör att administratörer kan ha utökade behörigheter.

### Felhantering:

Applikationen har implementerat grundläggande felhantering och validering:

- **Felmeddelanden**:
Felmeddelanden visas om användaren försöker logga in med ogiltiga uppgifter eller om någon försöker utföra en otillåten åtgärd utan rätt roll.

- **Datavalidering**:
Datavalidering görs både på serversidan och via Mongoose för att säkerställa att endast giltiga uppgifter sparas.

## Installation

För att installera beroenden:
```bash

npm install
```
För att köra applikationen:

```bash
nodemon index.ts
```