const lista = document.getElementById('lista')

const apiUrl = 'http://localhost:3000/filmes';

let edicao = false;
let idEdicao = 0;

let nome = document.getElementById('nome');
let imagem = document.getElementById('imagem');
let genero = document.getElementById('genero');
let nota = document.getElementById('nota');

const getFilmes = async () => {
  const response = await fetch(apiUrl);
  const filmes = await response.json();

  console.log(filmes);

  filmes.map(filme => {
    lista.insertAdjacentHTML(
      'beforeend',
      `
        <div class="col">
            <div class="card text-center">
            <img src="${filme.imagem}" class="card-img-top mt-3" alt="...">
            <div class="card-body">
                <h5 class="card-title">${filme.nome}</h5>
                <div class="card-info">
                  <h5><span class="badge bg-dark m-3">${filme.genero}</span></h5>
                  <h3 class="card-text m-3">Nota ${filme.nota}</h3>
                </div>
                <div>
                    <button class="btn btn-dark" onclick="editFilme('${filme.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteFilme('${filme.id}')">Excluir</button>
                    <input type="checkbox" onclick="checkAssistido('${filme.id}')" ${filme.assistido ? 'checked' : '' }> Assistido
                </div>
            </div>
            </div>
        </div>
        `
    )
  });
}

// [POST]
const submitForm = async event => {

  event.preventDefault();

  const filme = {
    nome: nome.value,
    imagem: imagem.value,
    genero: genero.value,
    nota: nota.value
  }

  if (edicao) {
    putFilme(filme, idEdicao);
  } else {
    createFilme(filme);
  }

  clearFields();
  lista.innerHTML = '';
}

const createFilme = async filme => {
  const request = new Request(`${apiUrl}/add`, {
    method: 'POST',
    body: JSON.stringify(filme),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });

  const response = await fetch(request);
  const result = await response.json();
  
  alert(result.message);
  getFilmes();
}

// [PUT]
const putFilme = async (filme, id) => {
  const request = new Request(`${apiUrl}/edit/${id}`, {
    method: 'PUT',
    body: JSON.stringify(filme),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });

  const response = await fetch(request);
  const result = await response.json();

  alert(result.message);
  edicao = false;
  idEdicao = 0;
  getFilmes();
}

// [DELETE]
const deleteFilme = async id => {
  const request = new Request(`${apiUrl}/delete/${id}`, {
    method: 'DELETE'
  });

  const response = await fetch(request);
  const result = await response.json();

  alert(result.message);

  lista.innerHTML = '';
  getFilmes();
}

// [GET / by id]
const getFilmeById = async id => {
  const response = await fetch(`${apiUrl}/${id}`);
  return await response.json();
}

const editFilme = async id => {

  edicao = true;
  idEdicao = id;

  const filme = await getFilmeById(id);

  nome.value = filme.nome;
  imagem.value = filme.imagem;
  genero.value = filme.genero;
  nota.value = filme.nota;
}

const checkAssistido = async (id) => {
  const filme = await getFilmeById(id);

  if (filme.assistido) {
    filme.assistido = false;
  } else {
    filme.assistido = true;
  }
  
  const response = await fetch(`${apiUrl}/edit/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(filme)
  });

  lista.innerHTML = '';
  getFilmes();
}

const clearFields = () => {
  nome.value = '';
  imagem.value = '';
  genero.value = '';
  nota.value = '';
}

getFilmes();