$('.nav ul li').click(function() {
    $(this).addClass("active").siblings().removeClass("active");
})

// this is suppose to make all the tabs veiw individual when you click on it's repective button.
//fix it if you can.
//it's not working.
const tabBtn = document.querySelectorAll('.nav ul li');
const tab = document.querySelectorAll('.tab');
function tabs(panelIndex) {
    tab.forEach(function(node) {
        node.style.display = 'none'
    });
    tab[panelIndex].style.display = 'block';
}
tabs(0);
