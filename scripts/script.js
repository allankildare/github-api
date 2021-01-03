// seguindo o modelo MVC
class Model {
    constructor () {
        this._name = ''
        this._username = ''
        this._image = ''
        this._repos = ''
    }

    SearchUser (user) {
        let request = new XMLHttpRequest()

        request.addEventListener('load', () => {
            if (request.status == 200) {
                let data = JSON.parse(request.responseText)

                this._Update(data)
            } else {
                this._Fail(request.status)
            }
        })

        request.open('GET', `https://api.github.com/users/${user}`, false)
        request.send()
    }

    SearchRepos (user) {
        let request = new XMLHttpRequest

        request.addEventListener('load', () => {
            if(request.status == 200) {
                let repoData = JSON.parse(request.responseText)
               
                this._repos = repoData
            }

        })

        request.open('GET', `https://api.github.com/users/${user}/repos`, false)
        request.send()
    }

    _Update (data) {
        this._name = data.name
        this._username = data.login
        this._image = data.avatar_url
    }

    _Fail(status) {
        let container = document.getElementById("container")

        container.innerHTML = `<h1>Houve um erro na busca de suas respostas</h1>
            <h2>Erro ${status}</h2>
            <p>Tenta novamente mais tarde`
    }
    
    getName() {
        if (this._name == null) {
            this._name = this._username
        }
        return this._name
    }

    getUsername() {
        return this._username
    }

    getImg() {
        return this._image
    }
}

class View {
    PrintUser (data) {
        let name = document.getElementById("name")
        let username = document.getElementById("username")
        let img = document.getElementById("profile-photo")

        name.textContent = data.getName()
        username.textContent = data.getUsername()
        img.src= data.getImg()

        let repository = document.getElementById("repo-title")
        repository.innerHTML += `<h1 class="title-repos">Aqui estão os repositórios de ${data.getName()}</h1>`
    }

    PrintRepos (data) {
        let repos = data._repos
        let repository = document.getElementById("repo")

        for (let repo of repos) {
            let repoName = `<p><strong>${repo.name}</strong></p>`
            repository.innerHTML += repoName
            
            let description = `<p>${repo.description}</p>`
            repository.innerHTML += description
            
            let url = `<a href="${repo.html_url}"><i class="fas fa-link"></i>Link</a>`
            
            repository.innerHTML += url

            if (repo.language == null) {
                repo.language = "Linguagem não identificada"
            }

            let language = `<p>${repo.language}</p>`
            repository.innerHTML += language
            console.log(repo)
        }
    }
}

class Controller {
    FindUser (user) {
        let model = new Model
        model.SearchUser(user)

        let view = new View
        view.PrintUser(model)
    }

    FindRepos (user) {
        let model = new Model
        model.SearchRepos(user)

        let view = new View
        view.PrintRepos(model)
    }
}

let btn = document.getElementById("buscar")

let controller = new Controller

btn.addEventListener("click", () => {
    let input = document.getElementById("usuario").value

    controller.FindRepos(input)
    controller.FindUser(input)
})