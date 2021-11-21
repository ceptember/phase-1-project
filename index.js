
function handleData (){
    fetch('db.json/data')
        .then(response => response.json())
        .then(data => {
            
            for (let item of data){
                let li = document.createElement('li');
                li.textContent = item.name; 
                document.getElementById('list').appendChild(li);
            }
        })
}


document.addEventListener('DOMContentLoaded', handleData); 

