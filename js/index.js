var range = 20;
var POKEAPI = "https://pokeapi.co/api/v2/";

var app = Vue.createApp({
  el: "#app",
  data: {
    actualId: 2,
    isCreated: false,
  },
  methods: {
    changeList(value) {
      this.$emit("filter", value);
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

      return response;
    },
    onBackClick: function () {
      this.$emit("back");
    },
    onNextClick: function () {
      this.$emit("next");
    },
    sortId() {
      this.$emit("sort");
    },
    changeColor: function (color, bgColor) {
      if (color == "#0c0c0d") {
        $("#app").addClass("dark");
      } else {
        $("#app").removeClass("dark");
      }
      $("#app").css({
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.63) 0%, rgba(0, 0, 0, 0.63) 100%), var(--" +
          bgColor +
          ")",
      });
    },
  },
  created: function () {
    this.isCreated = true;
    this.actualId = 1;
    if (this.actualId == 1) $(".back").hide();
    if (this.actualId == 10220) $(".next").hide();
  },
});

app.component("search-component", {
  template: `
  <header class="topo" ref="sc">
  <div class="input-box">
      <input type="search" placeholder="Search here" v-model="value" @compositionupdate="compositionUpdate($event)">
   <i class="icon ion-ios-search"></i>
   <i class="icon ion-ios-shuffle" @click="$root.sortId"></i>
  </div>
  
  <div class="filter"> Filter
      <i class="icon ion-ios-arrow-down"></i>

  </div>
</header>`,
  data: function () {
    return {
      value: "",
    };
  },
  methods: {
    compositionUpdate: function (event) {
      this.value = event.data;
    },
  },
  watch: {
    value: function (data) {
      this.$parent.changeList(data.toLowerCase());
    },
  },
});

app.component("nav-list", {
  template: `
  <div class="lista">
    <span v-for="(item, i) in filtered" class="element" :key="i" >
      <div @click = "$root.onHorizontalClick(item.url)">{{item.name}}</div>
    </span>
  </div>
  `,
  data: function () {
    return {
      list: [{ name: "aaa" }],
      filtered: [{ name: "aaa" }],
    };
  },
  methods: {},
  created: async function () {
    var aux = this.list;
    var response = await $.get(POKEAPI + "pokemon?limit=1200", function (data) {
      aux = data.results;
    });
    this.list = aux;
    this.filtered = aux;

    this.$root.$on("filter", (value) => {
      this.filtered = this.list.filter((el) =>
        el.name.toLowerCase.includes(value.trim())
      );
    });

    this.$root.$on("back", () => {
      var i = this.list.filter(
        (el) => el.url == `${POKEAPI}pokemon/${this.$root.actualId}/`
      );
      i = this.list.indexOf(i[0]) - 1;
      this.$root.onHorizontalClick(this.list[i].url);
    });
    this.$root.$on("next", () => {
      var i = this.list.filter(
        (el) => el.url == `${POKEAPI}pokemon/${this.$root.actualId}/`
      );
      i = this.list.indexOf(i[0]) + 1;
      this.$root.onHorizontalClick(this.list[i].url);
    });
    this.$root.$on("sort", () => {
      var tam = this.filtered.length;
      var random = Math.floor(Math.random() * tam);
      this.$root.onHorizontalClick(this.filtered[random].url);
    });

    return response;
  },
});

app.component("data-component", {
  template: `
  <div class="content">
  <div>
  
      <div class="title">
          <div class="subgrid">
              <div class="emoji">
                  <img :src="getLogo(pokemon.types[0].type.name)"/>
              </div>
              <div class="type">{{pokemon.types[0].type.name}}</div>
              <div class="name">{{getName()}}</div>
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
                  <div class="row" >
                      <span>Abilities</span>
                      <span>{{getAbility()}}</span>
                  </div>
              </div>
          </div>
   
          <div class="picture">
              <img :src="image" @error="getAnotherImg()"></img>

          </div>
      </div>
     
      <div class="stats">
        <div class="title">Stats</div>
        <div class="graphics" >
          <div class="row" v-for="(item, i) in pokemon.stats">
            <div class="name">{{getStatName(i)}}</div>
            <div class="bar" >
              <div class="inside" :style="{width: getStatWidth(i) }"></div>
            </div>
            <div class="base">{{item.base_stat}}</div>
          </div>
        </div>
         
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
      image: "",
      types: [{ name: "fire", bgColor: "", fontColor: "var(--text-white)" }],
      loaded:false
    };
  },
  watch: {
    "$root.actualId": function () {
      if(this.loaded) {
        this.loaded=false
        $(".loading").css({ opacity: 0.5 });
      $(".content").animate(
        {
          opacity: 0,
          paddingTop: 30,
        },
        500
      );

      $(".back").show();
      $(".next").show();

      if (this.$root.actualId == 1) $(".back").hide();
      if (this.$root.actualId == 10220) $(".next").hide();

      setTimeout(() => {
        $(".content .picture").css({
          marginRight: -50,
        });
        $(".content .subgrid").css({
          marginLeft: -50,
          paddingRight: 50,
        });
        $(".content .stats").css({
          marginTop: 50,
        });
        $(".content").css({
          paddingTop: 0,
        });
        this.loadPokemon();
      }, 500);

      return;
    }
    },
  },
  methods: {
    getImg(id) {
      return "assets/pokemon/" + id + ".png";
    },
    getAnotherImg() {
      this.image = this.getImg(4);
    },
    getLogo(type) {
      return "assets/icons/" + type + ".svg";
    },
    getName() {
      return this.pokemon.name.replaceAll("-", " ");
    },
    getStatWidth(i) {
      var total = 0;
      switch (i) {
        case 0:
          total = 255;
          break;
        case 1:
          total = 190;
          break;
        case 2:
          total = 250;
          break;
        case 3:
          total = 194;
          break;
        case 4:
          total = 250;
          break;
        case 5:
          total = 200;
          break;
      }
      console.log((this.pokemon.stats[i].base_stat / total) * 100 + "%");
      return (this.pokemon.stats[i].base_stat / total) * 100 + "%";
    },
    getStatName(i) {
      return this.pokemon.stats[i].stat.name.replaceAll("-", " ");
    },
    async loadPokemon() {
      var aux = this.pokemon;

      var response = await $.get(
        POKEAPI + "pokemon/" + this.$root.actualId,
        function (data) {
          aux = data;
          $(".loading").css({ opacity: 0 });
          console.log("entrou api");
        }
      );

      this.pokemon = aux;
      this.image = this.getImg(aux.id);

      var type = aux.types[0].type.name;
      switch (type) {
        case "electric":
        case "ice":
          this.$root.changeColor("#0c0c0d", type);
          break;
        default:
          this.$root.changeColor("#ffffff", type);
          break;
      }
      $(".content").animate(
        {
          opacity: 1,
          paddingTop: 0,
        },
        {
          duration: 500,
          queue: false,
          fail: () => console.log("falhou"),
          done:  () =>{ 
            console.log("done", this.$root.actualId)
          }

        }
      );
      $(".content .picture").animate(
        {
          opacity: 1,
          marginRight: 0,
        },
        {
          duration: 500,
          queue: false,
          fail: () => console.log("falhou"),
          done:  () => console.log("done"),
        }
      );
      $(".content .subgrid").animate(
        {
          opacity: 1,
          marginLeft: 0,
          paddingRight: 0,
        },
        {
          duration: 500,
          queue: false,
        }
      );
      $(".content .stats").animate(
        {
          opacity: 1,
          marginTop: 0,
        },
        {
          duration: 500,
          queue: false,
        }
      );
      this.loaded = true

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
    console.log("criou");
    this.loadPokemon();
  },
});

app.mount("#app")

