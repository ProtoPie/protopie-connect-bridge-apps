import sendMessage from '../libs/sendMessage';
import { ResultsHandler } from '../models/ResultsHandler';

const filterEqualKeys = (target: Object, source: Object) => {
  const result = {};

  for (const key in target) {
    if (typeof target[key] === 'object' || typeof source[key] === 'object') {
      const recursiveCallResult = filterEqualKeys(target[key], source[key]);
      if (Object.keys(recursiveCallResult).length) {
        result[key] = { ...source[key] };
      }
    }

    if (target[key] !== source[key]) {
      result[key] = target[key];
    }
  }

  return result;
};

const sendMessages: ResultsHandler = ({ acc }) => {
  if (!acc?.messages) {
    return;
  }

  let { messages } = acc;
  const prevMessages = acc?.prev?.messages;
  let isNew = true;

  if (prevMessages) {
    messages = filterEqualKeys(messages, prevMessages);
    isNew = !!Object.keys(messages).length;
  }

  if (isNew) {
    for (const messageId in messages) {
      sendMessage(messageId, messages[messageId]);
    }
  }
};

export default sendMessages;
