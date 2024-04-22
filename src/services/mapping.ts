import { RolesUser, UsersType } from "../api/auth";
import { SubjectType } from "../redux/subjects";
import { ArticlesType } from "../api/articles";
import { CommentType } from "../api/comments";
import { MessageType } from "../screens/Profile/ChatScreen";
import { TourType } from "../api/tours";

export const articleMapping = (articles: Array<any>): Array<ArticlesType> => {
  return articles.map((article) => {
    return {
      id: Number(article[0]),
      name: article[1],
      content: article[2],
      subject: article[3],
      likes: Number(article[4]),
      enable: article[5] == "1",
      report: article[6] == "1",
      reasonReport: article[7],
      lastName: article[8],
      firstName: article[9],
      patronymic: article[10],
      email: article[11],
      comments: commentMapping(article[12]),
      likesUser: [...article[13]].map((user) => Number(user)),
    };
  });
};

export const tourMapping = (tours: Array<any>): Array<TourType> => {
  return tours.map((article) => ({
    id: Number(article[0]),
    name: article[1],
    image: article[2],
    description: article[3],
    city: article[4],
    dateStart: Number(article[5]),
    dateEnd: Number(article[6]),
    price: Number(article[7]),
    likes: Number(article[8]),
    comments: commentMapping(article[9]),
    likesUser: [...article[10]].map((user) => Number(user)),
    signUser: [...article[11]].map((user) => Number(user)),
  }));
};

export const commentMapping = (comments: Array<any>): Array<CommentType> => {
  return comments.map((comment) => ({
    id: Number(comment[0]),
    text: comment[1],
    time: comment[2].split("-").reverse().join("."),
    likes: Number(comment[3]),
    last_name: comment[4],
    first_name: comment[5],
    patronymic: comment[6],
    email: comment[7],
    likesUser: [...comment[8]].map((user) => Number(user)),
  }));
};

export const userMapping = (user: any): UsersType => {
  return {
    id: Number(user[0]),
    lastName: user[1],
    firstName: user[2],
    patronymic: user[3],
    email: user[4],
    block: user[5] == 1,
    password: user[6],
    role: user[7] == 1 ? RolesUser.USER : RolesUser.ADMIN,
    tours: [...user[8]].map((user) => Number(user)),
  };
};

export const subjectMapping = (subject: any): SubjectType => {
  return {
    id: Number(subject[0]),
    name: subject[1],
  };
};

export const messageMapping = (messages: Array<any>): Array<MessageType> => {
  return messages.map((message) => ({
    id: Number(message[0]),
    idFrom: Number(message[1]),
    idTo: Number(message[2]),
    text: message[3],
    time: message[4],
  }));
};
