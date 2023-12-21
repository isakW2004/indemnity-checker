var worker = new Worker("worker.js");
async function updateResults(){
    worker.postMessage(document.getElementById('input').value);
    results = await waitForWorker(worker);
    for(var result of results){
        var node = document.createElement("div");
        node.classList.add('card')
        node.innerHTML = '<div class="text"><h5>'+result.binding.name+'</h5><small class="text-muted">'+result.binding.desc+'</small></div><img src="'+result.img+'">'
        document.getElementById("results").appendChild(node);
        var chip = document.createElement("div");
        var chipText = document.createElement("span");
        var chipIcon = document.createElement("span");
        chipIcon.classList.add("material-icons");
        chip.classList.add("chip")
        if(!result.binding.warning){
            chip.classList.add("chip__positive");
            chipText.innerText = "Indemnified";
            chipIcon.innerText = "check_circle";
            node.querySelector(".text").appendChild(chip);
        }else{
            chip.classList.add("chip__caution");
            chipText.innerText = "Note";
            chipIcon.innerText = "info";
            var warning = document.createElement("small");
            warning.innerText = result.binding.warning;
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

function waitForWorker(worker){
    return new Promise(function(resolve){
        worker.addEventListener("message",(e) => {
            resolve(e.data);
        })
    })
}