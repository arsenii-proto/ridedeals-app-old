<template>
  <div class="client-map">
    <!-- pk.eyJ1IjoiZGltaXRyaWkyNCIsImEiOiJjamZ4Mjd6YTc0c2NoMzNxZmZ0bm4zb2VoIn0.0gSumYwts1haOU7_SZ8cIw     -->

    <div id="top-panel">

    </div>
  
    <div class="row">
      <div id="map" v-bind:style="{ position: 'absolute', width:'100%', left:0, top: map.top +'px', bottom: map.bottom +'px' }">
        <div class="point"></div>
        
        <div class="address-wrapper">
          <span class="address" v-bind:class="{ hidden: !map.center_address }">{{ map.center_address || trans('client_map.address_not_found') }}</span>
        </div>

        <v-touch @tap="toggleSearch">
          <a class="search" v-bind:class="{ full: search_showen }">
            <vue-material-icon v-if="!search_showen" name="search" :size="32"></vue-material-icon>
          </a>
        </v-touch>

        <div class="btn-go-wrapper">
          <v-touch class="btn-go" v-bind:class="{ hidden: !map.center_address }">
              kfjghflkgjshdlfgkjl
          </v-touch>
        </div>

        <div class="search-box" v-if="search_showen">
          <input type="text" class="search-input" v-model="searchQuery" @keyup="getAddresses">
          <ul>
            <li v-for="(street, $i) in search_streets" :key="$i" v-if="$i < 10">
              {{ street.name }} | {{ street.parent_name }}
            </li>
          </ul>
        </div>

      </div>
    </div>

    <div id="bottom-panel" v-bind:style="{paddingBottom: ( $stiller.navbar.height.y / 2) + 'px'}">

      <ul>
        <li>
          <v-touch tag="a" class="active"><vue-material-icon name="near_me" :size="24"></vue-material-icon></v-touch>
        </li>
        <li>
          <v-touch tag="a"><vue-material-icon name="history" :size="24"></vue-material-icon></v-touch>
        </li>
        <li>
          <v-touch tag="a"><vue-material-icon name="favorite" :size="24"></vue-material-icon></v-touch>
        </li>
        <li>
          <v-touch tag="a"><vue-material-icon name="directions_car" :size="24"></vue-material-icon></v-touch>
        </li>
      </ul>

    </div>

  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
export default {
  name: 'ClientMap',
  data () {

    window.mapboxgl = mapboxgl

    return {
      map: {
        top: 30,
        bottom: 52 + ( this.$stiller.navbar.height.y / 2 ),
        center_address: '',
        wrapper: null,
        nominatim: "https://nominatim.openstreetmap.org/reverse",
        search: "https://point.md/ru/map/webmap/search",
      },
      search_showen: false,
      searchQuery: "",
      search_streets: [],
    }
  },

  mounted() {

    mapboxgl.accessToken = "pk.eyJ1IjoiZGltaXRyaWkyNCIsImEiOiJjamZ4Mjd6YTc0c2NoMzNxZmZ0bm4zb2VoIn0.0gSumYwts1haOU7_SZ8cIw"

    window.mapBoxWrapper = this.map.wrapper = new mapboxgl.Map({

      container: 'map',
      style: "mapbox://styles/dimitrii24/cjhxpyyfu1e172rp8ze0yikrf",
      minzoom: 1.3,
      center: [ 28.83257, 47.02472 ],
      zoom: 17,
      minZoom: 10,
      maxZ00m: 22

    })

    var touchMoveTimer = null

    this.map.wrapper.on('touchstart', e => {

      this.map.center_address = "";
      clearTimeout(touchMoveTimer);
      touchMoveTimer = null;
    })

    this.map.wrapper.on('touchend', e => {

      clearTimeout(touchMoveTimer);
      touchMoveTimer = null;
      touchMoveTimer = setTimeout(() => this.getAddress(), 200)          
    })

    var onUpdate = r => this.updateMap(r, onUpdate)

    this.$stiller.location.updater.on(onUpdate)
    this.getAddress()
  },

  methods: {

    updateMap(r, onUpdate) {

      if( this.map.wrapper ) {
        
        this.map.wrapper.setCenter([ r.long, r.lat ])
        
        this.$stiller.location.updater.off(onUpdate)

        this.getAddress()
      }
    },

    getAddress() {

      const center = this.map.wrapper.getCenter()
      this.$axios.get(this.map.nominatim, {

        params: {
          lat: center.lat,
          lon: center.lng,
          zoom: 18,
          format: 'json',
          addressdetails: 1,
          'accept-language': this.trans.lang,
        }

      }).then(r => {

        if( r.data && r.data.address && r.data.address.road && r.data.address.house_number ) {

          this.map.center_address = `${r.data.address.road}, ${r.data.address.house_number}`

        } else {

          this.map.center_address = ''
        }
      })
    },

    getAddresses() {

      console.log("this.searchQuery:" + this.searchQuery)

      if(! this.searchQuery ) return;

      this.$axios.get(this.map.search, {

        params: {
          q: encodeURIComponent(this.searchQuery)
        }

      }).then(r => {

        this.search_streets = [];

        r.data && r.data.list.forEach(street => {

          street.type == "street" && (this.search_streets.push(street))

        })
        
      })

    },

    toggleSearch() {

      this.search_showen = !this.search_showen

      if( this.search_showen ) {

        this.map.center_address = ''

      } else {

        this.getAddress()
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #map .mapboxgl-control-container {
    display: none
  }
  
  #map .mapboxgl-canvas {
    left: 0
  }

  #map .point{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    margin: -15px 0 0 -15px;
    background: rgba(29, 228, 174, 0.1);
    border-radius: 100%;
    z-index: 99;
  }

  #map .point:after{
    content: "";
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    width: 10px;
    height: 10px;
    background: rgba(29, 228, 174, 0.7);
    border-radius: 100%;
  }

  .address-wrapper{
    position: absolute;    
    top: 10px;
    left: 50%;
  }

  .address {
    position: relative;
    top: 0;
    left: -50%;
    display: table;
    padding: 7px 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    margin: 10px auto;
    transition: all 0.5s;
    z-index: 199;
  }

  .address.hidden{
    top: -100px;
  }

  .search{
    position: absolute;
    top: 100%;
    left: 100%;
    right: 2%;
    bottom: 2%;
    color: #1de4ae;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 10px 0;
    margin-top: -60px;
    margin-left: -60px;
    border-radius: 10px;
    z-index: 99;
    transition: all 0.5s;
  }

  .search.full{
    top: 2%;
    left: 2%;
    margin: 0;
    background: rgba(255, 255, 255, 0.8);
  }

  .btn-go-wrapper{
    position: absolute;    
    bottom: 10px;
    left: 50%;
  }

  .btn-go{
    position: relative;
    left: -50%;
    padding: 15px 20px;
    border-radius: 30px;
    background: #1de4ae;
    color: #212a49;
    display: table;
    margin:0 auto;
    transition: all 0.5s;
    z-index: 99;
    top: 0
  }

  .btn-go.hidden{
    top: 100px
  }

  .search-box{
    position: absolute;
    top: 2%;
    left: 2%;
    right: 2%;
    bottom: 2%;
    padding: 10px 15px;
    z-index: 299;
    color: #000
  }
</style>
