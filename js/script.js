// *************************** YOUR CODE BELOW *******************************
//******************TEST EARLY AND OFTEN USING console.log() ******************
//****************** SERIOUSLY TEST USING console.log()!!! ******************
/* global $ */
//https://api.giphy.com/v1/gifs/search?q=puppy&rating=pg&api_key=dc6zaTOxFJmzC
let query = '';
let offset = 0;

$("#search-button").click(function(){
  query = $("#search-term").val();
  $.ajax({
    url: `https://api.giphy.com/v1/gifs/search?q=${query}&rating=pg&api_key=dc6zaTOxFJmzC&offset=${offset}`,
    method: "GET", 
    success: (res) => {
        console.log(res);
        $(".gallery").empty();
        let gifs = res.data;
        render(gifs);
    }
  });
});

$(window).scroll(function() {
    console.log('run');
    if (query === ''){
        return;
    }
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        window.scrollBy(0, -1);
        offset += 25;
        $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${query}&offset=${offset}&rating=pg&api_key=dc6zaTOxFJmzC`,
        method: "GET", 
        success: (res) => {
            let gifs = res.data;
            render(gifs);
        }
      });
    }
});

function render(gifs){
    for (let i = 0; i < gifs.length; i++){
        let gif = gifs[i];
        let image = gif.images.original;
        let $gif = $('<img>').addClass('image');
        $gif.css('width', image.width);
        $gif.css('height', image.height);
        $gif.attr('src', image.url)
        $('.gallery').append($gif);
    }
}