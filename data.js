fetch("words.json")
    .then(res => res.json())
    .then(data => {
        words = data.shengci || data; 
        loadCard();
    });
