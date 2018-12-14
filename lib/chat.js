import Cookies from 'cookies';
import { keys } from './secure';
import { Message, User } from '../models';


export default (wss) => {
  wss.on('connection', async (ws, req) => {
    const sendMessage = (msg, client = ws) => client.send(JSON.stringify(msg));

    const getAllMessages = async () => {
      const messages = await Message.findAll({
        include: [{
          model: User,
        }],
      });
      return messages.map(el => el.get({ plain: true }));
    };

    const sendChatHistory = (messages, client = ws) => {
      sendMessage({
        type: 'CHAT_HISTORY',
        payload: messages,
      }, client);
    };

    const broadcast = (func) => {
      Array.from(wss.clients)
        .filter(client => client.readyState === ws.OPEN)
        .forEach(client => func(client));
    };

    const cookies = new Cookies(req, null, { keys });
    const userId = cookies.get('userId', { signed: true });

    const user = await User.findOne({
      where: { id: userId },
    });

    const allMessages = await getAllMessages();
    sendChatHistory(allMessages);
    sendMessage({
      type: 'USER_INFO',
      payload: { isAuthenticated: Boolean(user) },
    });

    ws.on('message', async (message) => {
      if (!user) return;

      const createdMessage = await Message.create({ message });

      await user.addMessage(createdMessage);

      const messages = await getAllMessages();
      broadcast(client => sendChatHistory(messages, client));
    });
  });
};
