const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder((message, orginalApiRequest) => {
  console.log('heres the message');
  console.log(message);
  console.log('heres the orginal api request');
  console.log(orginalApiRequest);
  const user = {'id': message.originalRequest.message.from.id, 'name': message.originalRequest.message.from.first_name};
  if (message.type === 'telegram') {
    if (message.text === '/start')
      return [
        new telegramTemplate.Text(`Hi ${user.name} with ${user.id}.`),
        .get()
        new telegramTemplate.Text(`Do you want to sign up for a daily Library of Congress sent to you?`)
        .addReplyKeyboard([['Sure sign me up'], ['No thanks'], ['Not yet']])
        .get();
      ]
    if (message.text === 'Sure sign me up')
      return [
        new telegramTemplate.Text(`Great choice, ${user.name}`),
        .get(),
        new telegramTemplate.ChatAction('typing').get(),
        new telegramTemplate.Text(`Tell me what you want to search for by replying with Search this thing`),
        .get(),
        new telegramTemplate.ChatAction('typing').get(),
        new telegramTemplate.Text(`For example:`),
        .get()
        new telegramTemplate.ChatAction('typing').get(),
        new telegramTemplate.Text(`Search puppies`),
        .get();
      ]

  }

});