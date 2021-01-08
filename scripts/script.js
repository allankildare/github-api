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

        let repoTitle = document.getElementById("repo-title")
        repoTitle.textContent = `Aqui estão os repositórios de ${data.getName()}`
    }

    PrintRepos (data) {
        let repos = data._repos
        
        let div = document.getElementById("repo")
        if (div != null) {
            div.parentNode.removeChild(div)
        }
        
        let main = document.getElementById("main")
        let repository = document.createElement("div")
        repository.id = "repo"
        repository.className = "repositories"
        main.appendChild(repository)

        for (let repo of repos) {
            let divRepo = document.createElement('div')
            divRepo.className = 'div-repository'
            
            let repoName = `<p class="repo-name"><strong>${repo.name}</strong></p>`
            divRepo.innerHTML += repoName
            
            if (repo.description == null) repo.description = "Nenhuma descrição encontrada..."
            let description = `<p>${repo.description}</p>`
            divRepo.innerHTML += description

            if (repo.language == null) repo.language = "Linguagem não identificada"
            let language = `<p style="font-style:italic;">${repo.language}</p>`
            divRepo.innerHTML += language

            let url = `<a href="${repo.html_url}" target="_blank" style="padding-bottom=10px;"><i class="fas fa-link"></i> Link</a>`
            divRepo.innerHTML += url

            repository.appendChild(divRepo)
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
    let inputValue = document.getElementById("usuario").value
    controller.FindRepos(inputValue)
    controller.FindUser(inputValue)
})

let input = document.getElementById("usuario")
input.addEventListener('keypress', e => {
    let inputValue = document.getElementById("usuario").value
    if (e.key == 'Enter' || e.keyCode == 13) {
        controller.FindRepos(inputValue)
        controller.FindUser(inputValue)
    }
})