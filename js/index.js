var range = 20;
var POKEAPI = "https://pokeapi.co/api/v2/";

$(document).ready(function () {
  $("input").on("input", function () {
    // do something
    var aux = list.filter((el) => el.name.includes($("input").val()));
    console.log(aux);
    if (aux.length > 0 && $("input").val().trim().length > 0)
      $(".input-box").addClass("searching");
    else $(".input-box").removeClass("searching");
    $(".element").each(function () {
      if ($(this).text().includes($("input").val().trim())) $(this).show();
      else $(this).hide();
    });
  });
});

Vue.component("nav-list", {
  template: `
  <div class="lista">
    <span v-for="(item, i) in list" class="element" :key="i" >
      <div @click = "$root.onHorizontalClick(item.url)">{{item.name}}</div>
    </span>
  </div>
  `,
  data: function () {
    return {
      list: [{ name: "aaa" }],
    };
  },
  methods: {},
  created: async function () {
    var aux = this.list;
    var response = await $.get(POKEAPI + "pokemon?limit=1200", function (data) {
      aux = data.results;
      console.log(aux);
    });
    this.list = aux;
    return response;
  },
});

Vue.component("data-component", {
  template: `
  <div class="content">
  <div>
  
      <div class="title">
          <div class="subgrid">
              <div class="emoji">
                  <img src="./assets/icons/fire.svg"/>
              </div>
              <div class="type">{{pokemon.types[0].type.name}}</div>
              <div class="name">{{pokemon.name}}</div>
              <div class="desc">It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.</div>
              <div class="details">
                  <div class="row">
                      <span>Height</span>
                      <span>{{getHeight()}}</span>
                  </div>
                  <div class="row">
                      <span>Weight</span>
                      <span>{{getWeight()}}</span>
                  </div>
                  <div class="row">
                      <span>Category</span>
                      <span>Lizard</span>
                  </div>
                  <div class="row" >
                      <span>Abilities</span>
                      <span>{{getAbility()}}</span>
                  </div>
              </div>
          </div>
   
          <div class="picture">
              <img class="picture" :src="getImg(pokemon.id)"></img>

          </div>
      </div>
     
      <div class="stats">
          <span>
              Stats
          </span>
      </div>
      <div class="evolutions"></div>
  </div>
</div>  
  `,
  data: function () {
    return {
      pokemon: {
        name: "Charmander",
      },
    };
  },
  watch: {
    // a computed getter
    "$root.actualId": function () {
      console.log("mudou id");
      this.loadPokemon();
      return this.actualId;
    },
  },
  methods: {
    getImg(id) {
      return "assets/pokemon/" + id + ".png";
    },
    async loadPokemon() {
      var aux = this.pokemon;
      console.log();
      var response = await $.get(
        POKEAPI + "pokemon/" + this.$root.actualId,
        function (data) {
          aux = data;
        }
      );

      this.pokemon = aux;
      console.log(this.pokemon);
      return response;
    },
    getHeight() {
      var str = this.pokemon.height / 10;
      return str + "M";
    },
    getWeight() {
      var str = this.pokemon.weight / 10;
      return str + "KG";
    },
    getAbility() {
      var str = this.pokemon.abilities[0].ability.name;
      str = str.replaceAll("-", " ");
      return str;
    },
  },
  created: function () {
    this.loadPokemon();
  },
});

var app = new Vue({
  el: "#app",
  data: {
    types: [{ name: "Fire", color: "" }],
    actualId: 4,
    isCreated: false,
  },
  methods: {
    onClick: function (url) {
      console.log("clicou");
      $.get(url, function (data) {
        console.log(data);
      });
    },
    getActualId: function () {
      return this.actualId;
    },
    getFormattedId: function () {
      var str = this.actualId.toString();
      while (str.length < 3) {
        str = "0" + str;
      }
      return `#${str}`;
    },
    onHorizontalClick: async function (url) {
      var aux = this.actualId;
      var response = await $.get(url, function (data) {
        aux = data.id;
      });

      this.actualId = aux;
      console.log(this.actualId);
      return response;
    },
  },
  mounted: function () {
    this.isCreated = true;
  },
});
