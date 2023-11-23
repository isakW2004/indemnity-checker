var brands;
var search = document.getElementById('input');
async function getBrands(){
    var response = await fetch("brands.json");
    brands = await response.json();
    document.getElementById("input").disabled=false;
    document.getElementById("input").focus()
}
getBrands();
function updateResults(){
    var results=[];
    document.querySelector('.no-results').hidden= true
    for(var i=0;i<brands.length;i++){
        searchBrand(input.value, brands[i], function(brandObject){
            brandObject.parentIndex= i;
            results.push(brandObject);
        })
    }
    results = sortResults(results)
    for(var binding of results){
        var node = document.createElement("div");
        node.classList.add('card')
        node.dataset.parentIndex = binding.parentIndex;
        node.innerHTML = '<div class="text"><h5>'+binding.name+'</h5><small class="text-muted">'+binding.desc+'</small></div><img src="'+brands[binding.parentIndex].logo+'">'
        document.getElementById("results").appendChild(node);
        var chip = document.createElement("div");
        var chipText = document.createElement("span");
        var chipIcon = document.createElement("span");
        chipIcon.classList.add("material-icons");
        chip.classList.add("chip")
        if(!binding.warning){
            chip.classList.add("chip__positive");
            chipText.innerText = "Indemnified";
            chipIcon.innerText = "check_circle";
            node.querySelector(".text").appendChild(chip);
        }else{
            chip.classList.add("chip__caution");
            chipText.innerText = "Note";
            chipIcon.innerText = "info";
            var warning = document.createElement("small");
            warning.innerText = binding.warning;
            node.querySelector(".text").appendChild(chip);
            node.querySelector(".text").appendChild(warning);
        }
        chip.appendChild(chipIcon);
        chip.appendChild(chipText);
    }
    if(results.length === 0){
        document.querySelector('.no-results').hidden= false
    }
}
function searchBrand(string, brandObject, callback){
    for(var binding of brandObject.bindings){
        if(simplify(binding.name).search(simplify(string)) != -1){
            callback(binding, brandObject)
        }
    }
}
function simplify(st){
    return st.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function sortResults(input){
    return input.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase(); 
        if (nameA < nameB) {
          return -1; 
        }
        if (nameA > nameB) {
          return 1; 
        }
        return 0; 
      });
}
