# SurveyBot
A Bot template that can help you to create a survey and make it more dynamic for people

## How to use the template

### What you will need

### Visual Studio Code

You will need VSCode to run the Terminal project.

### Azure Account

You will need an Azure Account. You can create one [here](https://azure.microsoft.com/en-us/free/)

#### Create a Bot Service

To create you Bot service, you can check [here](https://docs.microsoft.com/en-us/azure/bot-service/abs-quickstart?view=azure-bot-service-4.0)

#### Create a Sql Server

To create an SQL Server, you can check [here](https://docs.microsoft.com/en-us/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal)

#### Bot Framework Emulator

You will need Bot Framework Emulator to test your bot. To get it and learn how to use it, you can go [here](https://github.com/microsoft/BotFramework-Emulator).

### How to use it

For the beginning, you can open the folder template inside the repos on VSCode.
After that, you can directly launch the program and connect you on the Bot Framework Emulator by the url given inside the terminal.

Here's a result you will have (don't forget to say hi to your bot):
![a show of what there's basicly inside the bot](https://github.com/micbelgique/SurveyBot/blob/master/images/BotFirstStart.png)

#### Want to save you data

By default, the bot will not save the data because you don't give it the url of your database. To make it possible, you will need to modify the [DataManager](https://github.com/micbelgique/SurveyBot/blob/master/template/helpers/dataManager.js).

Inside of it, you will need to put your database information inside:

```javascript
 constructor() {
        this.config = {
            user: 'YourUser',
            password: "YourPassword",
            server: 'YourURLPassword',
            database: 'YourDatabase',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        };
```

and also inside the GetConnection function where you need to put the connection you receive from Azure:

```javascript
getConnection() {
        return sql.connect(
            "YourSqlServerStringConnection"
        );
    }
```

When you have done that, it will create a table 'survey' and put the result there.

### Get the data

To use the data or the result, you can use directly Power Bi by the file available inside the sql server on Azure. You can check how to do it [here](https://docs.microsoft.com/en-us/power-bi/connect-data/service-gateway-sql-tutorial).

Or you can use Excel also to retrieve the data and you can see how to do it [here](https://docs.microsoft.com/en-us/azure/azure-sql/database/connect-excel).

## Edit the bot

To learn how to edit the bot, click [here](https://github.com/micbelgique/SurveyBot/blob/master/modifyBot.md).

## Deploy it on Azure

If you want to deploy it on Azure, you can follow [these steps](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-deploy-az-cli?view=azure-bot-service-4.0&tabs=javascript).

## Example of Integration

You can find an example of integration of the bot inside integrationExample folder.

It's a React app that start directly the conversation with your bot.
