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

const type = 'simpleQuestion';

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

        this.confirm = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);
            const value = inputToValue(step.result, this.label, this.values, locale, strings);
            const user = await this.userProfileProperty.get(step.context, {});
            user[this.label] = value;
            return await step.next();
        };
    }
}

module.exports.SimpleQuestion = SimpleQuestion;
