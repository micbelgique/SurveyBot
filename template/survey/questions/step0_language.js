const { ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
const { strings } = require('../../i18n/strings');
const { getLanguage } = require('../../helpers/language');

class LanguageStep {
    constructor(languagePreferenceProperty, userProfileProperty) {
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.userProfileProperty = userProfileProperty;
        this.label = 'language';

        this.step = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);

            this.values = locale === 'fr' ? { fr: 1, nl: 2 } : { nl: 2, fr: 1 };

            const choices = Object.keys(this.values);
            const questionLabels = choices.map((k) => strings[locale][this.label][k]);

            return await step.prompt('CHOICE_PROMPT', {
                prompt: strings[locale][this.label].question,
                choices: ChoiceFactory.toChoices(questionLabels),
                style: ListStyle.heroCard
            });
        };

        this.confirmation = async (step) => {
            const locale = await getLanguage(this.languagePreferenceProperty, step.context);

            const input = step.result;
            const choices = Object.keys(this.values);
            const questionLabels = choices.map((k) => ({
                key: k,
                value: strings[locale][this.label][k]
            }));
            const choosen = questionLabels.find((c) => c.value === input.value);
            await this.languagePreferenceProperty.set(step.context, choosen.key);

            const user = await this.userProfileProperty.get(step.context, {});
            user.language = choosen.key;

            const updatedLocale = await getLanguage(this.languagePreferenceProperty, step.context);
            await step.context.sendActivity(strings[updatedLocale][this.label].confirmation);
            return await step.endDialog({
                locale: updatedLocale,
                nextDialog: 'WATERFALL_DIALOG'
            });
        };
    }
}

module.exports.LanguageStep = LanguageStep;
