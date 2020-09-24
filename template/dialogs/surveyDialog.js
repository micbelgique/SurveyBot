// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog,
    ChoiceFactory,
    ChoicePrompt,
    ListStyle
} = require('botbuilder-dialogs');

const { LanguageStep } = require('../survey/questions/step0_language');
const { SimpleQuestion } = require('../survey/questions/step1_simpleQuestion');
const { ComplexQuestion } = require('../survey/questions/step2_complexQuestion');
const { strings } = require('../i18n/strings');
const { getLanguage } = require('../helpers/language');
const { Answers } = require('../survey/answers');

const { inputToValue } = require('../helpers/inputToValue');

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const LANGUAGE_DIALOG = 'LANGUAGE_DIALOG';
const FORM_DIALOG = 'FORM_DIALOG';

class SurveyDialog extends ComponentDialog {
    constructor(userState, userProfileProperty, languagePreferenceProperty, dataManager) {
        super('surveyDialog');

        this.userState = userState;
        this.userProfileProperty = userProfileProperty;
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.dataManager = dataManager;

        console.debug('Enter dialog');

        const languageStep = new LanguageStep(languagePreferenceProperty, userProfileProperty);
        const simpleQuestion = new SimpleQuestion(
            languagePreferenceProperty,
            userProfileProperty
        );
        const complexQuestion = new ComplexQuestion(languagePreferenceProperty, userProfileProperty);

        const defaultChoicePrompt = new ChoicePrompt('CHOICE_PROMPT');

        this.addDialog(
            new WaterfallDialog(LANGUAGE_DIALOG, [languageStep.step, languageStep.confirmation])
        );

        this.addDialog(
            new WaterfallDialog(FORM_DIALOG, [
                simpleQuestion.step,
                simpleQuestion.confirm,
                complexQuestion.step,
                complexQuestion.confirm,
                this.confirmStep.bind(this),
                this.onConfirmResponseStep.bind(this)
            ])
        );

        this.addDialog(
            new WaterfallDialog(WATERFALL_DIALOG, [
                this.initialStep.bind(this),
                this.mainDialogStep.bind(this),
                this.summaryStep.bind(this)
            ])
        );

        this.addDialog(defaultChoicePrompt);

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        
        if (!turnContext.activity.text && turnContext.activity.value) {
            turnContext.activity.text = JSON.stringify(turnContext.activity.value);
        }

        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async initialStep(step) {
        await this.userProfileProperty.get(step.context, new Answers());
        return await step.beginDialog(LANGUAGE_DIALOG);
    }

    async mainDialogStep(step) {
        return await step.beginDialog(FORM_DIALOG);
    }

    async confirmStep(step) {
        const label = 'confirm';
        const values = { correct: 'correct', startOver: 'startOver' };

        const locale = await getLanguage(this.languagePreferenceProperty, step.context);

        const choices = Object.keys(values);
        const questionLabels = choices.map((k) => strings[locale][label][k]);

        return await step.prompt('CHOICE_PROMPT', {
            prompt: strings[locale][label].question,
            choices: ChoiceFactory.toChoices(questionLabels),
            style: ListStyle.heroCard
        });
    }

    async onConfirmResponseStep(step) {
        const label = 'confirm';
        const values = { correct: 'correct', startOver: 'startOver' };

        const locale = await getLanguage(this.languagePreferenceProperty, step.context);
        const value = inputToValue(step.result, label, values, locale, strings);
        if (value === values.startOver) {
            const answers = await this.userProfileProperty.get(step.context, {});
            answers.simpleQuestion = undefined;
            answers.complexQuestion = undefined;
            return await step.beginDialog(FORM_DIALOG);
        }
        return await step.next();
    }

    async summaryStep(step) {
        // Get the current profile object from user state.
        const answers = await this.userProfileProperty.get(step.context, {});

        this.dataManager.storeData(answers);

        const locale = await getLanguage(this.languagePreferenceProperty, step.context);
        await step.context.sendActivity(strings[locale].thankYou);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is the end.
        return await step.endDialog();
    }
}

module.exports.SurveyDialog = SurveyDialog;
