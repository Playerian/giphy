// *************************** YOUR CODE BELOW *******************************
//******************TEST EARLY AND OFTEN USING console.log() ******************
//****************** SERIOUSLY TEST USING console.log()!!! ******************
/* global $ */
//https://api.giphy.com/v1/gifs/search?q=puppy&rating=pg&api_key=dc6zaTOxFJmzC
let query = '';
let offset = 0;
let random = false;
let imgCount = 0;
let imgs = [];
let requested = false;

let searchFoo = function(){
    imgCount = 0;
    random = false;
    if (query === ''){
        query = 'anime';
    }
    query = $("#search-term").val();
    
    $(".gallery").empty();
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${filterQuery(query)}&rating=pg&api_key=dc6zaTOxFJmzC&offset=${offset}`,
        method: "GET", 
        success: (res) => {
            render(res.data);
        },
        error: (err) => {
            console.log('err');
        }
    });
}

$("#search-button").click(() => {
    searchFoo();
});

$("#random-button").click(() => {
    random = true;
    query = $("#search-term").val();
    if (query === ''){
        query = 'anime';
    }
    $.ajax({
    url: `https://api.giphy.com/v1/gifs/search?q=${filterQuery(query)}&rating=pg&api_key=dc6zaTOxFJmzC&limit=1000`,
    method: "GET", 
    success: (res) => {
        console.log(res);
        $(".gallery").empty();
        let gifs = res.data;
        render(gifs, true);
    }
    });
});

$(window).scroll(function() {
    if (query === '' || random === true){
        return;
    }
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        appendMore();
    }
});

function appendToPage(gif){
    let image = gif.images.original;
    let $gif = $('<img>').addClass('image');
    $gif.css('width', image.width);
    $gif.css('height', image.height);
    $gif.attr('src', image.url);
    imgCount ++;
    let id = imgs.length;
    $gif.attr('id', id);
    imgs.push(gif);
    $gif.click(function(){
        let $it = $(this);
        $("#modal-image").attr('src', imgs[$it.attr('id')].images.original.url);
        $('#deleteModal').modal();
        $('#modalYes').click(function(){
            $('#modalYes').off('click');
            $gif.off('click');
            $it.fadeOut(500, function(){
                $it.remove();
            });
            imgCount --;
            imgs.splice($it.attr('id'), 1);
            if (imgCount < 10){
                appendMore();
            }
        });
        $('#modalNo').click(()=>{
            $('#modalYes').off('click');
            $('#modalNo').off('click');
        });
        
    });
    $('.gallery').append($gif);
}

function render(gifs, random){
    if (random){
        if (gifs.length > 0){
            appendToPage(gifs[Math.floor(Math.random()*gifs.length)]);
        }
    }else{
        for (let i = 0; i < gifs.length; i++){
            appendToPage(gifs[i]);
        }
    }
}

function appendMore(){
    if (random === true || requested === true){
        return;
    }
    requested = true;
    offset += 25;
    $.ajax({
    url: `https://api.giphy.com/v1/gifs/search?q=${filterQuery(query)}&offset=${offset}&rating=pg&api_key=dc6zaTOxFJmzC`,
    method: "GET", 
    success: (res) => {
        let gifs = res.data;
        render(gifs);
        setTimeout(function(){
            requested = false;
        },2000);
    }
  });
};

function filterQuery(query){
    return query.split(' ').join('-');
}