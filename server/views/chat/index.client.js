import React from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types';
import Textarea from 'react-textarea-autosize';


const withSubscription = WrappedComponent => class WithSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.chatRef = React.createRef();
    this.state = {
      isAuthenticated: false,
      chatHistory: [],
      sendMessage: () => {},
      ws: null,
      isDataReady: false,
    };
  }

  componentDidMount() {
    const HOST = location.origin.replace(/^http/, 'ws')
    const ws = new WebSocket(HOST);
    // const ws = new WebSocket('ws://localhost:4000');

    this.setState({ ws });

    ws.addEventListener('open', () => {
      this.setState({ sendMessage: ws.send.bind(ws) });
    });

    ws.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'CHAT_HISTORY') {
        this.setState({
          chatHistory: data.payload,
          isDataReady: true,
        }, () => {
          this.chatRef.current.scrollToBottomOfChat();
        });
      } else if (data.type === 'USER_INFO') {
        const { isAuthenticated } = data.payload;
        this.setState({ isAuthenticated });
      }
    });
  }

  render() {
    const {
      chatHistory, sendMessage, isDataReady, isAuthenticated,
    } = this.state;

    return (
      isDataReady ?
          <WrappedComponent
            chatHistory={chatHistory}
            sendMessage={sendMessage}
            isAuthenticated={isAuthenticated}
            ref={this.chatRef}
          /> : null
    );
  }
};


class Chat extends React.Component {
  static propTypes = {
    sendMessage: PropTypes.func.isRequired,
    chatHistory: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any.isRequired,
      message: PropTypes.any.isRequired,
      User: PropTypes.any.isRequired,
    })).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.chatHistoryRef = React.createRef();
    this.state = {
      newMessageText: '',
    };
  }

  scrollToBottomOfChat = () => {
    const chatHistoryEl = this.chatHistoryRef.current;
    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
  }

  onMessageChange = (e) => {
    const { value } = e.target;
    this.setState({ newMessageText: value });
  }

  onMessageSend = (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();

    const { sendMessage } = this.props;
    const { newMessageText } = this.state;
    if (newMessageText === '') return;

    sendMessage(newMessageText);
    this.setState({ newMessageText: '' });
  }

  onInputHeightChange = (height) => {
    this.chatHistoryRef.current.style.setProperty('--inputHeight', `${height}px`);
  }

  render() {
    const { newMessageText } = this.state;
    const { chatHistory, isAuthenticated } = this.props;

    return (
      <div className="chat">

        <h1 className="mb-25">Chat Client</h1>

        <div className="chat__history mb-20" ref={this.chatHistoryRef}>
          {chatHistory.map(el => (
            <div className="chat__message-wrap" key={el.id}>
              <img src="/img/heavy-rain.png" className="chat__user-avatar"/>
              <div className="chat__message-right-block">
                <div className="chat__user-name">
                  {el.User.firstName} {el.User.lastName}
                </div>
                <div className="chat__user-message">{el.message}</div>
              </div>
            </div>
          ))}
        </div>

        <Textarea
          className="form-control"
          onChange={this.onMessageChange}
          onKeyDown={this.onMessageSend}
          onHeightChange={this.onInputHeightChange}
          value={newMessageText}
          disabled={!isAuthenticated}
          placeholder={isAuthenticated ? 'Message' : 'Please sign in'}
        />

      </div>
    );
  }
}


const ChatContainer = withSubscription(Chat);

render(<ChatContainer/>, document.querySelector('#chat'));
