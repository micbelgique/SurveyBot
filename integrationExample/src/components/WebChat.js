import React from 'react';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
import { v4 as uuidv4 } from 'uuid';

export default (props) => {
  // Variables
  const directLine = createDirectLine({
    token: 'FsOrrSPbPac.v2-wHr909ulTtJ78kAbyqocPbFK5zBvfvZOxtj-UTkk'
  });
  const id = uuidv4();

  // Store
  const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      dispatch({
        type: 'WEB_CHAT/SEND_EVENT',
        payload: {
          name: 'webchat/join',
          value: { language: props.locale }
        }
      });
    } else if (action.type === 'DIRECT_LINE/POST_ACTIVITY_FULFILLED') {
      let containers = document.querySelectorAll('.ac-container.ac-adaptiveCard');
      if (containers && containers.length > 0) {
        let container = containers[containers.length - 1];
        let toggles = container.querySelectorAll('.ac-toggleInput input');
        let button = container.querySelector('.ac-pushButton');
        let number = 0;

        if (toggles && toggles.length > 0) {
          // disabled
          button.disabled = true;

          // listen
          toggles.forEach((toggle) => {
            toggle.addEventListener('change', (event) => {
              if (event.target.checked) {
                number += 1;
              } else {
                number += -1;
              }

              button.disabled = number === 0;
            });
          });
        }
      }
    } else if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
      let toggles = document.querySelectorAll('.ac-toggleInput input');
      for (let i = 0; i < toggles.length; i++) {
        toggles[i].disabled = true;
      }

      let buttons = document.querySelectorAll('.ac-pushButton');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }

    return next(action);
  });

  return (
    <ReactWebChat
      locale={props.locale}
      directLine={directLine}
      store={store}
      createStore={(data) => {
        console.log('store');
        console.log(data);
      }}
      userID={id}
      styleOptions={{
        hideSendBox: true,
        botAvatarImage: '/assets/img/avatar/bot.svg',
        richCardWrapTitle: true
      }}
      botAvatarInitials="CB"
    />
  );
};
