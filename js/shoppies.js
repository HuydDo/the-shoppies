const titleInput = document.querySelector('#titleInput')
const resultsList = document.querySelector('.resultsList')
const nominationList = document.querySelector('.nominationsList')
let buttons = document.querySelector('button')
let count = 0;
let nominationsArray = [];

document.addEventListener('DOMContentLoaded', getLocalNominations);

document.querySelector('.submitButton').addEventListener('click', submitButton)

let remove = () => {
  window.localStorage.clear()
  window.location.reload();
}

function submitButton(){
  remove();
  nominationList.innerHTML='';
  resultsList.innerHTML='';
  document.querySelector('.outputContainer').classList.add('hidden')
  document.querySelector('.banner').classList.add('hidden')
}

let full = () => { 
  document.querySelector('#complete').classList.toggle("hidden");
  document.querySelector('.banner').classList.toggle("hidden")
}

let removeSelection = (e) => {
  let movieTitle = e.target.previousSibling.textContent
  removeLocalNominations(movieTitle);
  let currentResultList = document.querySelector('.resultsList').children

  for(let i = 0; i < currentResultList.length; i++){
    console.log(currentResultList[i].firstChild);
    if(currentResultList[i].firstChild.id){
      if(currentResultList[i].firstChild.innerHTML.includes(movieTitle)){
        currentResultList[i].firstChild.childNodes[1].firstChild.classList.remove('opacity')
        currentResultList[i].firstChild.id=""
      }
    }
  }

  nominationsArray = nominationsArray.filter((a,b)=>{ return ( a !== movieTitle)})

  console.log(currentResultList);

  if (count>0) {
    count--;
  }

  e.target.parentElement.remove()
  if (!document.querySelector('.complete').classList.contains('hidden')) {
    full();
  }
}

let nominateSelection = (e) => {
  let currentNominationList = document.querySelector('#nominations').children

  if (count<=4 && (!nominationsArray.includes(e.target.parentElement.parentElement.firstChild.textContent))){
    e.target.classList.add('opacity');

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = e.target.parentElement.previousSibling.textContent
    e.target.parentElement.parentElement.id= `${count}`
    saveLocalNomination(e.target.parentElement.previousSibling.textContent);

    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)

    nominationsArray.push(e.target.parentElement.parentElement.firstChild.textContent)
    count++;
    if (count===5){
      full();
    }
  }
}

let showResults = (results) => {

  inputSearch.textContent = `Results for "${titleInput.value}"`
  titleInput.value="";

  results=results.sort( (a, b) => b.year - a.year)

    results.forEach((item, i) => {
    let listItem = document.createElement('li')
    listItem.classList.add('movieItem')

    let movieHeaderSec=document.createElement('section')
    movieHeaderSec.classList.add('movieHeader')
    let movieDetailsSec=document.createElement('section')
    movieDetailsSec.classList.add('movieDetails')
    let detailsSection=document.createElement('section')
    detailsSection.classList.add('details')

    let image = document.createElement('img')
    image.src = item.poster;
    image.classList.add('poster')
    detailsSection.appendChild(image)
    movieDetailsSec.appendChild(detailsSection)

    let movieTitle = document.createElement('h3')
    movieTitle.classList.add(`nominate${i}`)
    movieTitle.classList.add('movieTitle')
    let movieNode = document.createTextNode(`${item.movieTitle}  (${item.year})`);
    movieTitle.appendChild(movieNode)
    let buttonSection = document.createElement('section')
    let nominateButton = document.createElement('button')
    let nominateButtonNode = document.createTextNode('Nominate')
    nominateButton.appendChild(nominateButtonNode)
    nominateButton.classList.add(`nominate${i}`)
    nominateButton.addEventListener("click", nominateSelection)
   
    buttonSection.appendChild(nominateButton)

    movieHeaderSec.appendChild(movieTitle)
    movieHeaderSec.appendChild(buttonSection)

    listItem.appendChild(movieHeaderSec)
    listItem.appendChild(movieDetailsSec)

    document.querySelector('.loader').style.display= 'none';
    resultsList.appendChild(listItem)
  });
}

let movieSearch =  () => {
  document.querySelector('#output').classList.remove('hidden')
    inputSearch.textContent = `Searching for "${titleInput.value}"`
    document.querySelector('.loader').style.display='flex'
  const yearCheckEnd = 2000
  const currentYear = 2020
  const searchResults = []

  let title = document.querySelector('#titleInput').value.toString().trim() 
  let counter=0;

  if (document.querySelector('#output').classList!=="outputContainer"){
    resultsList.innerHTML=''
  }

  while(title.includes(" ")){   
    title=title.replace(" ", `+`)
  }

    const proxyurl = "https://cors-anywhere.herokuapp.com/";

    fetch(proxyurl+`www.omdbapi.com/?apikey=c2d156e8&s=${title}`)
      .then(response=>response.json())
      .then(data=>{
        console.log(data);
        if (data.Response=== "False") {
          document.querySelector('.nothingFound').style.display="block";
        }
        counter++
        if ( data.Response!== "False"){
          data['Search'].forEach((search, i) => {
            searchResults.push({
              year : parseInt(search.Year),
              movieTitle : search.Title,
              poster : search.Poster,
              type : search.Type,
              imdbID : search.imdbID
            })
          });

          document.querySelector('.nothingFound').style.display='none';
          showResults(searchResults);
        }

      })


}

function getLocalNominations(){

  let nominations;
  if(localStorage.getItem('nominations') === null){ 
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  if (nominations.length>0) {
    document.querySelector('#output').classList.remove('hidden')
  }
  nominations.forEach((nomination, i) => {

    count = nominations.length;

    let listItem = document.createElement('li')
    let movieSelection = document.createElement('h3')
    movieSelection.textContent = nomination


    let removeButton = document.createElement('button')
    let removeButtonNode = document.createTextNode('Remove')
    removeButton.appendChild(removeButtonNode)
    removeButton.addEventListener('click',removeSelection)

    listItem.appendChild(movieSelection);
    listItem.appendChild(removeButton)
    nominationList.appendChild(listItem)
    nominationsArray= nominations
    if (count===5){
      full();
    }
  });
}

let removeLocalNominations = (nomination) =>{
  let nominations;
  if(localStorage.getItem('nominations') === null){ 
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  const nominationIndex = nomination;
  nominations.splice(nominations.indexOf(nominationIndex), 1)
  localStorage.setItem('nominations', JSON.stringify(nominations)) 

}

let saveLocalNomination = (nomination) => {
  let nominations;
  if(localStorage.getItem('nominations') === null){ 
    nominations = [];
  }
  else{
    nominations = JSON.parse(localStorage.getItem('nominations'))
  }
  nominations.push(nomination);
  localStorage.setItem('nominations', JSON.stringify(nominations)) 
}

titleInput.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    if(titleInput.value){
      movieSearch();
    }
    else{
      console.log('input is empty');
    }
  }
});
