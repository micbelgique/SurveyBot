# Create a complex question

## Get and change the code

If you want to create a simple question. You can copy paste the code from the [step2_complexQuestion.js](https://github.com/micbelgique/SurveyBot/blob/develop/template/survey/questions/step2_complexQuestion.js).

When it's done, you will need to change some parts of the code like the simple question. So refer you on the simple question for this part.

## Add the question text and the answers

Same as the simple question

## Add to the dialog

Same as the simple question

## Add the answer inside the database

You will need to modify the [answers.js](https://github.com/micbelgique/SurveyBot/blob/master/template/survey/answers.js) file. You will need to add the possible answer of your question like that:

```javascript
class Answers {
    constructor(
        simpleQuestion,
        complexQuestion,
        myNameQuestion
    ) {
        this.simpleQuestion = simpleQuestion;
        this.complexQuestion = complexQuestion;
        this.myNameQuestion = myNameQuestion
    }
}
```

And after that, you need to go inside the [DataManager](https://github.com/micbelgique/SurveyBot/blob/master/template/helpers/dataManager.js).

Inside it, you can change the name of your table like that you don't have conflict problem and add a column for your answer.

Pay attention, for the Complex Question, you will not store just an answer so you need to put it as a varchar. So it will be somehting like that:

```javascript
getTable() {
        const table = new sql.Table('survey2'); // or temporary table, e.g. #temptable

        table.columns.add('language', sql.VarChar(10), { nullable: true });
        table.columns.add('simpleQuestion', sql.Int, { nullable: true });
        table.columns.add('complexQuestion', sql.NVarChar(sql.MAX), { nullable: true });
        table.columns.add('myNameQuestion', sql.NVarChar(sql.MAX), { nullable: true });
        table.columns.add('environment', sql.VarChar(50), { nullable: true });

        return table;
    }
```

And after is the same as a simple question.