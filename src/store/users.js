import axios from 'axios';

function login(users) {
  return axios.get("http://localhost:5354/login", {
    params: {
      email: users.email,
      password: users.password
    }
  });
}

function registration(user) {
  return axios.post("http://localhost:5354/authorization", user);
}

function setUser(userData) {
  window.localStorage.setItem('user', JSON.stringify(userData));
}

function getUser() {
  return JSON.parse(window.localStorage.getItem('user'));
}

export const usersModule = {
  login,
  registration,
  setUser,
  getUser
};

