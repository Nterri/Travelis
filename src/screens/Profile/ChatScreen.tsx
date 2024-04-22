import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button } from "../../components/UI/Button/Button";
import { getMessageAPI, sendMessageAPI } from "../../api/message";
import { setLoadingChat } from "../../redux/chat";
import { Input } from "../../components/UI/Input/Input";
import { UsersType } from "../../api/auth";
import { goBack } from "../../services/navigate";

export type MessageType = {
  id: number;
  idFrom: number;
  idTo: number;
  text: string;
  time: number;
};

export interface IChatScreenProps {}
export const ChatScreen: React.FC<IChatScreenProps> = function ({}) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.app.user);
  const users = useSelector((state: RootState) => state.admin.users);
  const chatLoading = useSelector(
    (state: RootState) => state.chat.loadingSendChat,
  );

  const [currentUserTo, setCurrentUserTo] = useState<UsersType>();
  const [currentMessage, setCurrentMessage] = useState<Array<MessageType>>([]);
  const [field, setField] = useState<string>("");

  const sendMessage = () => {
    dispatch(setLoadingChat(true));
    sendMessageAPI({
      idFrom: user?.id,
      idTo: currentUserTo?.id,
      text: field,
    }).finally(() => {
      setField("");
      dispatch(setLoadingChat(false));
    });
  };

  const getMessage = () => {
    getMessageAPI().then((result) => {
      setCurrentMessage(
        result.result
          .filter(
            (message) =>
              (message.idFrom === user?.id &&
                message.idTo === currentUserTo?.id) ||
              (message.idFrom === currentUserTo?.id &&
                message.idTo === user?.id),
          )
          .sort((a, b) => a.time - b.time),
      );
    });
  };

  useEffect(() => {
    getMessage();
    let timeout = setInterval(getMessage, 2000);

    return () => clearInterval(timeout);
  }, [user, currentUserTo]);

  const getTime = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="chat">
      <div className={!currentUserTo ? "chat-sidebar active" : "chat-sidebar"}>
        <div className="chat-sidebar__title">Пользователи</div>
        {users
          .filter((u) => u.id !== user?.id)
          .map((user) => (
            <div
              key={user.id}
              className={
                user?.id === currentUserTo?.id ? "chat_btn active" : "chat_btn"
              }
              onClick={() => {
                setCurrentUserTo(users.find((u) => u.id === user.id));
              }}
            >
              {user.firstName} {user.lastName} ({user.email})
            </div>
          ))}
      </div>
      <div className={!!currentUserTo ? "chat-content active" : "chat-content"}>
        {!!currentUserTo && (
          <>
            <Button
              callback={() => setCurrentUserTo(undefined)}
              className="chat-content__back"
            >
              Назад к чатам
            </Button>
            <div className="chat-content__name">
              {currentUserTo?.firstName} {currentUserTo?.firstName} (
              {currentUserTo?.email})
            </div>
            <div className="chat-content__list">
              {currentMessage.map((message) => (
                <div
                  className={
                    message.idFrom === user?.id
                      ? "chat-content__list-item from"
                      : "chat-content__list-item"
                  }
                  key={message.id}
                >
                  <div className="chat-content__list-item__text">
                    {message.idFrom === user?.id ? "Я: " : "Собеседник: "}
                    {message.text}
                  </div>
                  <div className="chat-content__list-item__time">
                    {getTime(message.time)}
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <Input
                label={"Комментарий"}
                value={field}
                onChange={(value) => setField(value)}
              />
              {!chatLoading && (
                <Button callback={sendMessage} className="search">
                  Отправить
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
