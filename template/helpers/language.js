const getLanguage = async (languagePreferenceProperty, context) => {
    const language = await languagePreferenceProperty.get(context, 'fr-FR');

    let userLanguage = '';
    switch (language) {
    case 'fr':
    case 'fr-FR':
    case 'fr-BE':
        userLanguage = 'fr';
        break;
    case 'nl':
    case 'nl-BE':
        userLanguage = 'nl';
        break;
    default:
        userLanguage = 'fr';
        break;
    }
    return userLanguage;
};

module.exports.getLanguage = getLanguage;
