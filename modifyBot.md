# How to add new question on the bot

## Create a new File name

You will need to create a new file named as the question tag of your question inside template/survey/questions. You can create a new js file to start.

### Create a simple question

#### Get and change the code

If you want to create a simple question. You can copy paste the code from the [step1_simpleQuestion.js](https://github.com/micbelgique/SurveyBot/blob/develop/template/survey/questions/step1_simpleQuestion.js).

When it's done, you will need to change some parts of the code.

The first one is

```javascript
const type = 'simpleQuestion';
```

You will need to put the name of your question like "myNameQuestion".

After that, you will need to modify the name of the class

```javascript
class SimpleQuestion {
    constructor(languagePreferenceProperty, userProfileProperty) {
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.userProfileProperty = userProfileProperty;
        this.label = type;
        this.values = values;

        this.step = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);
            const choices = Object.keys(this.values);
            const questionLabels = choices.map((k) => strings[locale][this.label][k]);

            return await step.prompt('CHOICE_PROMPT', {
                prompt: strings[locale][this.label].question,
                choices: ChoiceFactory.toChoices(questionLabels),
                style: ListStyle.heroCard
            });
        };
```

You can put the name of your question but here, like that:"MyNameQuestion" with a uppercase.

And after that, you need to change one more part:

```javascript
module.exports.SimpleQuestion = SimpleQuestion;
```

And there you put the name of your class.
So it will give somethin like this:

```javascript
const { ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
const { strings } = require('../../i18n/strings');
const { getLanguage } = require('../../helpers/language');
const { inputToValue } = require('../../helpers/inputToValue');

const values = {
    firstChoice: 1,
    secondChoice: 2,
    thirdChoice: 3,
    fourthChoice: 4,
    fifthChoice: 5
};

const type = 'myNameQuestion';

class MyNameQuestion {
    constructor(languagePreferenceProperty, userProfileProperty) {
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.userProfileProperty = userProfileProperty;
        this.label = type;
        this.values = values;

        this.step = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);
            const choices = Object.keys(this.values);
            const questionLabels = choices.map((k) => strings[locale][this.label][k]);

            return await step.prompt('CHOICE_PROMPT', {
                prompt: strings[locale][this.label].question,
                choices: ChoiceFactory.toChoices(questionLabels),
                style: ListStyle.heroCard
            });
        };

        this.confirm = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);
            const value = inputToValue(step.result, this.label, this.values, locale, strings);
            const user = await this.userProfileProperty.get(step.context, {});
            user[this.label] = value;
            return await step.next();
        };
    }
}

module.exports.SimpleQuestion = MyNameQuestion;
```

#### Add the question text and the answers

To put the text you want to be shown to the final user, you will need to add it inside the i18n folder.

So you will need to go inside /template/i18n/ and add new strings for your questions in french and in dutch.

You can add it everywhere you want and it will be something like that:

From strings.fr.js

```javascript
myNameQuestion: {
        question:
            'Ceci est la question de myNameQuestion',
        firstChoice: 'Premier choix',
        secondChoice: 'Second choix',
    },
```

From strings.nl.js

```javascript
myNameQuestion: {
        question:
            'Dit is de vraag van myNameQuestion',
        firstChoice: 'Eerste keuze',
        secondChoice: 'tweede keus',
    },
```

As you can see, we only have two answers, so we will need to modify the myNameQuestion.js file.

We will just need to modify the values to only put 2 values like this:

```javascript
const values = {
    firstChoice: 1,
    secondChoice: 2,
};
```

#### Add to the dialog

To add it inside the dialog, you will need to add the declaration of the class MyNameQuestion inside the [surveyDialog file](https://github.com/micbelgique/SurveyBot/blob/master/template/dialogs/surveyDialog.js).
You will need to add it at both place inside the constructor:

```javascript
        ...
        const complexQuestion = new ComplexQuestion(languagePreferenceProperty, userProfileProperty);
        //You need to had this declaration like this
        const myNameQuestion = new MyNameQuestion(languagePreferenceProperty, userProfileProperty);
        ...
        this.addDialog(
            new WaterfallDialog(FORM_DIALOG, [
                simpleQuestion.step,
                simpleQuestion.confirm,
                complexQuestion.step,
                complexQuestion.confirm,
                // You will need to add it inside the waterfallDialog here
                myNameQuestion.step,
                myNameQuestion.confirm,
                this.confirmStep.bind(this),
                this.onConfirmResponseStep.bind(this)
            ])
        );
...
```

#### Add the answer inside the database