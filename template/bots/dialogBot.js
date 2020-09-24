// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { strings } = require('../i18n/strings');
const { getLanguage } = require('../helpers/language');

class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(
        conversationState,
        userState,
        dialog,
        userProfileProperty,
        languagePreferenceProperty
    ) {
        super();
        if (!conversationState) {
            throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        }
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        this.languagePreferenceProperty = languagePreferenceProperty;
        this.userProfileProperty = userProfileProperty;

        this.onMessage(async (context, next) => {
            await context.sendActivities([{ type: 'typing' }, { type: 'delay', value: 2000 }]);

            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);
            await next();
        });

        this.onEvent(async (context, next) => {
            if (context.activity.name === 'webchat/join') {
                await languagePreferenceProperty.set(
                    context,
                    context.activity.value.language || 'fr'
                );

                const locale = await getLanguage(languagePreferenceProperty, context);

                await context.sendActivities([
                    { type: 'message', text: strings[locale].welcome1 },
                    { type: 'typing' },
                    { type: 'delay', value: 1000 },
                    { type: 'message', text: strings[locale].welcome2 },
                    { type: 'typing' },
                    { type: 'delay', value: 2000 },
                    { type: 'message', text: strings[locale].welcome3 }
                ]);
            }

            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);
            await next();
        });

        // DEBUG on BotFramework
        // this.onMembersAdded(async (context, next) => {
        //     const membersAdded = context.activity.membersAdded;
        //     for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        //         if (membersAdded[cnt].id === context.activity.recipient.id) {
        //             await languagePreferenceProperty.set(context, context.activity.locale || 'fr');

        //             const locale = await getLanguage(languagePreferenceProperty, context);

        //             await context.sendActivity(JSON.stringify(context));
        //             await context.sendActivities([
        //                 { type: 'message', text: strings[locale].welcome1 },
        //                 { type: 'typing' },
        //                 { type: 'delay', value: 1000 },
        //                 { type: 'message', text: strings[locale].welcome2 },
        //                 { type: 'typing' },
        //                 { type: 'delay', value: 2000 },
        //                 { type: 'message', text: strings[locale].welcome3 }
        //             ]);
        //         }
        //     }

        //     // Run the Dialog with the new message Activity.
        //     await this.dialog.run(context, this.dialogState);
        //     await next();
        // });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}

module.exports.DialogBot = DialogBot;
