import Message from '../interfaces/message';

const groupMessagesByDate = (messages: Message[]): { date: string, messages: Message[] }[] => {
  const tempStorage: { [key: string]: { date: string, messages: Message[] } } = {};

  messages.sort((message1: Message, message2: Message) => {
    if (new Date(message1.dateObject) > new Date(message2.dateObject)) return 1;
    if (new Date(message1.dateObject) < new Date(message2.dateObject)) return -1;
    return 0;
  });

  messages.forEach((item: Message) => {
    const dateKey = new Date(item.dateObject).toDateString();

    if (!tempStorage[dateKey]) {
      tempStorage[dateKey] = {
        date: dateKey,
        messages: [],
      };
    }

    tempStorage[dateKey].messages.push(item);
  });

  return Object.values(tempStorage);
}

export default groupMessagesByDate;
