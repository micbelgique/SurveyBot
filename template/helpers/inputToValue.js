module.exports.inputToValue = (input, type, values, locale, strings) => {
    const choices = Object.keys(values);
    const questionLabels = choices.map((k) => {
        return { key: k, label: strings[locale][type][k] };
    });
    const found = questionLabels.find(q => q.label === input.value);
    return values[found.key];
};
