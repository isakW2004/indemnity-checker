var brands;

self.onmessage = async function(query){
    var results = [];
    if(typeof brands == "undefined"){
       brands = await getBrands();
    }
    for await (var brand of brands){
        for(var result of await searchBrand(query.data, brand)){
            results.push({binding:result, img:brand.logo});
        }
    }
    self.postMessage(sortResults(results));
}

async function searchBrand(string, brandObject){
    var result = [];
    for(var binding of brandObject.bindings){
        if(simplify(binding.name).search(simplify(string)) != -1 || simplify(binding.desc).search(simplify(string)) != -1){
            result.push(binding);
        }
    }
    return result;
}
function simplify(st){
    return st.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function sortResults(input){
    return input.sort(function(a, b) {
        var nameA = a.binding.name.toUpperCase();
        var nameB = b.binding.name.toUpperCase(); 
        if (nameA < nameB) {
          return -1; 
        }
        if (nameA > nameB) {
          return 1; 
        }
        return 0; 
      });
}
async function getBrands(){
    var response = await fetch("brands.json");
    return await response.json();
}