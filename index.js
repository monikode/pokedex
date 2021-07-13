var list = [];
var range = 20;

$(document).ready(function () {
  carregaLista();

  $("input").on("input", function () {
    // do something
    $(".element").each(function () {
      if ($(this).text().includes($("input").val())) $(this).show();
      else $(this).hide();
    });
  });

  $(".nav").on("scroll", function () {
    if ($(".nav").css("overflow-y") === "scroll") {
      if (this.scrollTop >= this.scrollHeight - this.offsetHeight)
        addElements();
    } else {
      if (this.scrollLeft >= this.scrollWidth - this.offsetWidth) addElements();
    }
  });
});

async function addElements() {
  console.log($(".element").length, range);
  if ($(".element").length <= range && $(".element").length < list.length) {
    for (var i = range; i < range + 20; i++) {
      await $.get(list[i].url, function (data) {
        img = '<img src="' + data.sprites.front_default + '" alt="">';
        nome = "<div>" + list[i].name + "</div>";
        $(".lista").append(
          "<div class='element' id='" + i + "'>" + img + nome + "</div>"
        );
      });
      $(".element:eq(" + i + ")").click(function () {
        var i = this.id;
        mudaAtual(list[i]);
      });
    }
    range += 20;
  }
}

async function mudaAtual({ url, name }) {
  await $.get(url, function (data) {
    $(".foto img").attr("src", data.sprites.front_default);
    $(".nome").text(name);
  });
}

async function carregaLista() {
  var img = "";

  await $.get(
    "https://pokeapi.co/api/v2/pokemon?limit=1200&offset=0",
    function (data) {
      list = data.results;
      console.log(list.length);
      mudaAtual(list[0]);
    }
  );

  for (var i = 0; i < 20; i++) {
    await $.get(list[i].url, function (data) {
      img = '<img src="' + data.sprites.front_default + '" alt="">';
      nome = "<div>" + list[i].name + "</div>";
      $(".lista").append(
        "<div class='element' id='" + i + "'>" + img + nome + "</div>"
      );
    });
    $(".element:eq(" + i + ")").click(function () {
      var i = this.id;
      mudaAtual(list[i]);
    });
  }
}
