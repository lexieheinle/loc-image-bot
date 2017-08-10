const rp = require('minimal-request-promise');
const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;
const search = require('./lib/search.js');
const database = require('./lib/database.js');

module.exports = botBuilder((message, orginalApiRequest) => {
  console.log('heres the message');
  console.log(message);
  console.log('heres the orginal api request');
  console.log(orginalApiRequest);
  const user = {'id': message.originalRequest.message.from.id, 'name': message.originalRequest.message.from.first_name};
  if (message.type === 'telegram'){
    if (message.text === '/start')
      return [
        new telegramTemplate.Text(`Hi ${user.name} with ${user.id}.`).get(),
        new telegramTemplate.Text(`Do you want to sign up for a daily Library of Congress sent to you?`)
        .addReplyKeyboard([['Sure sign me up'], ['No thanks'], ['Not yet']])
        .get()
      ];
    if (message.text === 'Sure sign me up')
      return [
        new telegramTemplate.Text(`Great choice, ${user.name}`).get(),
        new telegramTemplate.ChatAction('typing').get(),
        new telegramTemplate.Text(`Tell me what you want to search for by replying with Search this thing`).get(),
        new telegramTemplate.ChatAction('typing').get(),
        new telegramTemplate.Text(`For example: Send puppies`).get()
      ];
    if (message.text.indexOf('Search') === 0){
      const clean_message = message.text.slice(7);
      return search.getSearch(clean_message)
        .then(photo => {
          return [
            new telegramTemplate.Text(`Finding ${clean_message}`).get(),
            new telegramTemplate.ChatAction('typing').get(),
            new telegramTemplate.Pause(100).get(),
            new telegramTemplate.ChatAction('upload_photo').get(),
            new telegramTemplate.Photo(`http:${photo.thumbnail}`).get(),
            new telegramTemplate.Text(`Get more info from the Library of Congress: http:${photo.link}`).get()
          ];
        })
      }
      if (message.text.indexOf('Send') === 0){
        const clean_message = message.text.slice(5);
        return database.addUser(user.id.toString(), clean_message)
          .then(response => {
            if(response) {
              return [
                new telegramTemplate.ChatAction('typing').get(),
                new telegramTemplate.Pause(100).get(),
                new telegramTemplate.Text(`Awesome, ${user.name}! You'll get a daily photo sent of ${clean_message}.`).get(),
              ]
            } else {
              return [
                new telegramTemplate.ChatAction('typing').get(),
                new telegramTemplate.Pause(100).get(),
                new telegramTemplate.Text(`Opps, sorry ${user.name}; something bad happened.`).get(),
              ]
            }
          })
      }
  }

});
