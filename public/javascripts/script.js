window.onload = function(){

  const remover = document.getElementsByClassName("remover");
  const modal = document.getElementById("modal");
  const upload = document.getElementById("upload");
  const title = document.getElementById("title");
  const about = document.getElementById("about");
  const search = document.getElementById("search");
  const inputSearch = document.getElementById("inputSearch"); 
  const addfilm = document.getElementById("addfilm");
  

  let enabled = true;

  document.addEventListener("click", function(e){
    if(e.target.className == "delete"){
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `/delete/${e.target.dataset.delete}`, true);
        xhr.send();
        xhr.onreadystatechange = function() { 
          if (xhr.readyState != 4) return;
          if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
          } else {
            console.log("GO!");
            console.log(xhr.status + ': ' + xhr.statusText);
            e.target.parentNode.parentNode.remove();
          }
        }
    }else if(e.target.classList.contains("edit")){
        let item1 = e.target.closest("li").nextElementSibling;
        item1.classList.toggle("hide");
        e.target.classList.toggle("toggled");
    }else if(e.target.id == "addfilm" || e.target.classList.contains("arrow")){
        upload.classList.toggle("hide");
        addfilm.classList.toggle("arrowup");
    }
  });

  upload.addEventListener("submit", function(e){
  	e.preventDefault();
  	if(title.value && about.value){
      if(enabled){
         upload.submit();
         enabled = false;
      }
  	}else{
  		alert("Введите название и описание!");
  	}
  });



}