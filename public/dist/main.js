var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let usersArray = [];
class User {
    constructor(id, login, name, bio, public_repos, repos_url, repos, message) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.bio = bio;
        this.public_repos = public_repos;
        this.repos_url = repos_url;
        this.repos = repos;
        this.message = message;
    }
}
function getUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        const username = document.getElementById('user').value;
        let userData = yield (yield fetch(`https://api.github.com/users/${username}`)).json();
        let userExist = userData.id > 0;
        if (userExist) {
            let newUser = new User(userData.id, userData.login, userData.name, userData.bio, userData.public_repos, userData.repos_url, userData.repos, userData.message);
            _getUserRepos(newUser);
            usersArray.push(newUser);
        }
        else {
            alert("User " + userData.message);
        }
    });
}
function _getUserRepos(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userRepos = yield (yield fetch(user.repos_url)).json();
        let userHaveRepos = userRepos.length > 0;
        if (userHaveRepos) {
            user.repos = userRepos;
        }
    });
}
function sumAllRepo() {
    let sumOfAllRepos = 0;
    const sumRepos = document.querySelector('#sumRepos');
    usersArray.forEach(user => {
        sumOfAllRepos += user.public_repos;
    });
    sumRepos.innerText = 'Soma de todos os repositórios: ' + sumOfAllRepos;
}
function showAllUsers() {
    const ul = document.querySelector('body ul');
    ul.replaceChildren();
    usersArray.forEach(user => {
        let newLi = document.createElement('li');
        let shownRepos = [];
        let repoLimit = user.repos.slice(0, 3);
        repoLimit.forEach(repo => shownRepos.push(repo.name));
        let userText = `ID:${user.id} | User: ${user.login} | Name: ${user.name} | Public Repos: ${user.public_repos}\nRepos: ${shownRepos.join(', ')}...`;
        newLi.innerText = userText;
        ul.appendChild(newLi);
    });
}
const searchEvent = document.querySelector('#search').addEventListener('click', getUserData);
const showEvent = document.querySelector('#list').addEventListener('click', showAllUsers);
const sumEvent = document.querySelector('#sumRepo').addEventListener('click', sumAllRepo);
