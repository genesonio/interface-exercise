interface User {
  id: number,
  login: string,
  name: string,
  bio: string,
  public_repos: number,
  repos_url: string,
  repos: Repository[],
  message?: "Not found"
}

interface Repository {
  name: string,
  description: string,
  fork: boolean,
  stargazers_count: number
}

let usersArray: User[] = []

class User implements User {
  id: number
  login: string
  name: string
  bio: string
  public_repos: number
  repos_url: string
  repos: Repository[]
  message?: "Not found"

  constructor (id: number, login: string, name: string, bio: string, public_repos: number, repos_url: string, repos: Repository[], message: "Not found") {
    this.id = id
    this.login = login
    this.name = name
    this.bio = bio
    this.public_repos = public_repos
    this.repos_url = repos_url
    this.repos = repos
    this.message = message
  }
}

class Repo implements Repository {
  name: string
  description: string
  fork: boolean
  stargazers_count: number

  constructor(name: string, description: string, fork: boolean, stargazers_count: number) {
    this.name = name
    this.description = description
    this.fork = fork
    this.stargazers_count = stargazers_count
  }
}

async function getUserData() {
  const username = (<HTMLInputElement>document.getElementById('user')).value
  let userData: User = await (await fetch(`https://api.github.com/users/${username}`)).json()
  let userExist = userData.id > 0
  if (userExist) {
    let newUser = new User(userData.id, userData.login, userData.name, userData.bio, userData.public_repos, userData.repos_url, userData.repos, userData.message)
    _getUserRepos(newUser)
    usersArray.push(newUser)
  } else {
    alert("User " + userData.message)
  }
}

async function _getUserRepos(user: User) {
  let userRepos: Repository[] = await (await fetch(user.repos_url)).json()
  let userHaveRepos: boolean = userRepos.length > 0
  if (userHaveRepos) {
    let repoArray: Repository[] = []
    userRepos.forEach(repo => {
      let newRepo = new Repo(repo.name, repo.description, repo.fork, repo.stargazers_count)
      repoArray.push(newRepo)
    }
    )
    user.repos = repoArray
  }
}

function sumAllRepo() {
  let sumOfAllRepos: number = 0
  const sumRepos = <HTMLParagraphElement>document.querySelector('#sumRepos')
  usersArray.forEach(user => {
    sumOfAllRepos += user.public_repos
  })
  sumRepos.innerText ='Soma de todos os repositórios: ' + sumOfAllRepos
}

function showAllUsers() {
  const ul = document.querySelector('body ul')
  ul.replaceChildren()
  
  usersArray.forEach(user => {
    let newLi = document.createElement('li')
    let shownRepos = []
    let repoLimit = user.repos.slice(0, 3)
    repoLimit.forEach(repo => shownRepos.push(repo.name))

    let userText = `ID:${user.id} | User: ${user.login} | Name: ${user.name} | Public Repos: ${user.public_repos}\nRepos: ${shownRepos.join(', ')}...`
    newLi.innerText = userText
    ul.appendChild(newLi)
  });
}

const searchEvent = document.querySelector('#search').addEventListener('click', getUserData)
const showEvent = document.querySelector('#list').addEventListener('click', showAllUsers)
const sumEvent = document.querySelector('#sumRepo').addEventListener('click', sumAllRepo)