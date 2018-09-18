const API_KEY = "63282de0-b77e-11e8-bf0e-e9322ccde4db";
//anon function, no arguments "event handler" once event happens
//once page loads AND when hash changes, checkHash
document.addEventListener("DOMContentLoaded", () => {
  checkHash()
  //want to assign window.onhashchange a referece to function,
  //but not actually call the function
  window.onhashchange = checkHash
});

//checks for hash in url before showing galleries, either object or gallery,
//if no hash, display home page
function checkHash() {
  if (window.location.hash) {
    if (window.location.hash.startsWith("#o")){
      showObjectsDetails(window.location.hash.substring(2))
    }
    else {
      showObjects(window.location.hash.substring(1)); //takes from 1 to the end
    }
  }
  else {
    showGalleries(`https://api.harvardartmuseums.org/gallery?apikey=${API_KEY}`);
  }
}

function showGalleries(url) {
  //hide objects list, details, button, show gallery list and back button
  document.querySelector("#all-galleries").style.display = "block";
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#object-details").style.display = "none";
  document.querySelector("#back").style.display = "none";

  //fetch returns promise object, .then in this case calling anon function that takes argument response
  // .then(function(response) {
  //     return response.json()
  // })
  fetch(url)
  .then(response => response.json()) //json also returns promise, converts into object, .then passes into next .then as data
  .then(data => {
    //append to gallery div list of galleries,
    //when link is clicked, hash of galleryid is appended to url
    data.records.forEach(gallery => {
      document.querySelector("#galleries").innerHTML += `
        <li>
          <a href="#${gallery.id}">
            Gallery #${gallery.id}: ${gallery.name} (Floor ${gallery.floor})
          </a>
        </li>
      `;
      //href appends this hash link to end of url
      //'' are template strings, where we can substitute things into it${}
    });
    if (data.info.next) {
      showGalleries(data.info.next);
    }
  })
}


function showObjects(id) {
  //hide gallery list, object details, show object list and back button
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#all-objects").style.display = "block";
  document.querySelector("#object-details").style.display = "none";
  document.querySelector("#all-objects-title").innerHTML = `Objects`;
  document.querySelector("#back").style.display = "block";


  //fetching details, passing in info to function showObjectsDetails
  fetch(`https://api.harvardartmuseums.org/object?apikey=${API_KEY}&gallery=${id}&size=1000`) //fetching all obj details
  .then(response => response.json())
  .then(data => {
    console.log(data)
    data.records.forEach(object => {
      document.querySelector("#objects-list").innerHTML += `
      <li>
      <a href="#o${object.id}">
        ${object.title}
      </a>
      </li>
      `
    });
  });
};

function showObjectsDetails(objectid) {
  //hide galleries list, objects list, show obj details and back button
  document.querySelector("#all-objects").style.display = "none";
  document.querySelector("#all-galleries").style.display = "none";
  document.querySelector("#object-details").style.display = "block";
  document.querySelector("#back").style.display = "block";

  fetch(`https://api.harvardartmuseums.org/object/${objectid}?apikey=${API_KEY}`) //fetching all obj details
  .then(response => response.json())
  .then(object => {
    document.querySelector("#details-title").innerHTML = `Details of ${object.title}`;
    document.querySelector("#actual-details").innerHTML = `
    <td>${object.title}</td>
    <td>${object.description}</td>
    <td>${object.provenance}</td>
    <td>${object.accessionyear}</td>
    <td><img src="${object.primaryimageurl} "></td>
    `
})
}
