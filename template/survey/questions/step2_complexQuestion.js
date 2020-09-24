const { CardFactory, MessageFactory } = require('botbuilder');
const { ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
const { Dialog } = require('botbuilder-dialogs');
const { strings } = require('../../i18n/strings');
const { getLanguage } = require('../../helpers/language');

const values = {
    firstChoice: 1,
    secondChoice: 2,
    thirdChoice: 3,
    fourthChoice: 4,
    fifthChoice: 5
};

const type = 'complexQuestion';

class ComplexQuestion {
    constructor(languagePreferenceProperty, userProfileProperty) {
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.userProfileProperty = userProfileProperty;
        this.label = type;
        this.values = values;

        this.getCard = async (locale) => {
            const card = {
                $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                type: 'AdaptiveCard',
                version: '1.2',
                body: [
                    {
                        type: 'TextBlock',
                        text: strings[locale][this.label].question,
                        wrap: true
                    }
                ],
                actions: [
                    {
                        type: 'Action.Submit',
                        title: strings[locale].submit
                    }
                ]
            };

            for (const [key, value] of Object.entries(this.values)) {
                card.body.push({
                    id: value.toString(),
                    type: 'Input.Toggle',
                    title: strings[locale][this.label][key.toString()],
                    wrap: true
                });
            }

            return card;
        };

        this.step = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);
            const card = await this.getCard(locale);
            const choices = Object.keys(this.values);
            const questionLabels = choices.map((k) => strings[locale][this.label][k]);

            await step.prompt('CHOICE_PROMPT', {
                prompt: MessageFactory.attachment(CardFactory.adaptiveCard(card)),
                choices: ChoiceFactory.toChoices(questionLabels),
                style: ListStyle.none
            });
            
            return Dialog.EndOfTurn;
        };

        this.confirm = async (step) => {
            const activity = step.context.activity;
            const values = [];
            for (const [key, value] of Object.entries(activity.value)) {
                if (value === 'true' || value === 'True') {
                    values.push(Number(key));
                }
            }
            const user = await this.userProfileProperty.get(step.context, {});
            user[this.label] = values;
            return await step.next();
        };
    }
}

module.exports.ComplexQuestion = ComplexQuestion;
