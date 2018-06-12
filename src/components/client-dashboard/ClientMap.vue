<template>
  <div class="client-map">

    <div id="top-panel" ref="top_panel" v-bind:class="{ hidden: !map.center.address }">
      <div class="row" style="margin: 0; padding: 5px;">
        <div class="col s3">
          <v-touch  @tap="toggleSearch">
            <vue-material-icon name="search" :size="26"></vue-material-icon>
          </v-touch>
        </div>
        <div class="col s6" style="padding: 5px">
          {{ map.center.address || '' }}
        </div>
        <div class="col s3" style="padding: 0">
          <v-touch class="btn btn-small theme" @tap="makeOrder" v-if="!search_showen">
            {{ trans('client_map.btn_next') }}
          </v-touch>
        </div>
      </div>
    </div>
  
    <div id="map" v-bind:style="{ bottom: map.bottom +'px' }">
      <div class="point" v-bind:style="{ opacity: (search_showen ? 0 : 1) }"></div>
    </div>

    <transition name="apear-feaded">
      <div class="search-box theme"
        v-if="search_showen"
        v-bind:class="{showen: search_showen}"
        v-bind:style="{ top: 0, bottom: map.bottom + 'px' }">
        <div class="row" ref="search_box_input" style="margin: 0; padding-bottom: 15px">
          <div class="input-search-wrapper col s12">
            <input type="text" class="search-input" @keyup="getAddresses" ref="search_input">
          </div>
        </div>
        <div class="row under-abs-search" v-bind:style="{ 'max-height': 'calc(100% - '+ map.search_box_input +'px)' }">
          <div class="col s12 items-wrapper">
            <transition-group name="streets-li" tag="ul">
              <v-touch @tap="streetSelected($i)" tag="li" v-for="(street, $i) in search_streets" :key="$i" class="street-address">
                <span class="street-name">
                  {{ street.name }}
                </span>
                <span class="street-city">
                  {{ street.parent_name }}
                </span>
                <ul v-if="street.show_buildings" class="street-buildings row">
                  <v-touch @tap="locationSelected(street, bulding)" tag="li" v-for="(bulding, $j) in street.buildings" :key="$j" style="padding: 7px" class="col s3">
                    <a class="col s12 btn theme darken-4">
                    {{ bulding }}
                    </a>
                  </v-touch>
                </ul>
              </v-touch>
            </transition-group>
          </div>
        </div>
      </div>
    </transition>


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
    let self = this

    return {
      map: {
        get top() {

          return self.$refs.top_panel.clientHeight
        },
        get search_box_input() {

          return ( self.$refs.search_box_input || { clientHeight: 0 } ).clientHeight
        },
        bottom: 52 + ( this.$stiller.navbar.height.y / 2 ),
        center: {

          address: '',
          street_id: null,
          house_number: null,
        },
        wrapper: null,
        nominatim: "https://point.md/ru/map/webmap/near",
        search: "https://point.md/ru/map/webmap/search",
        getCoords: "https://point.md/ru/map/webmap/get_street"
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

      this.map.center.address = "";
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

      this.map.center.lat = center.lat
      this.map.center.lon = center.lng

      this.$axios.get(this.map.nominatim, {

        params: {
          lat: center.lat,
          lon: center.lng
        }

      }).then(r => {

        if( r.data && r.data.building ) {

          this.map.center.address = `${r.data.building.street_name}, ${r.data.building.number}`
          this.map.center.street_id = r.data.building.street_id
          this.map.center.house_number = r.data.building.number

        } else {

          this.map.center.address = ''
          this.map.center.street_id = null
          this.map.center.house_number = null
        }

      })
    },

    getAddresses( e ) {

      if(! e.target.value.toLowerCase() || e.target.value.toLowerCase().length < 3 ) return;


      this.$axios.get(this.map.search, {

        params: {
          q: e.target.value.toLowerCase()
        }

      }).then(r => {

        this.search_streets = [];

        r.data && r.data.list.forEach(street => {

          street.show_buildings = false

          street.type == "street" && (this.search_streets.push(street))

        })
        
      })

    },

    toggleSearch() {

      this.map.search_box_input = 12;
      this.search_showen = !this.search_showen

      setTimeout(() => {
        
        this.map.search_box_input = 12;
        this.$refs.search_input.focus();
      }, 300)

    },

    streetSelected($i) {
      
      this.search_streets.forEach((street, i) => {

        this.search_streets[i].show_buildings = ( $i == i )

      })
    },

    locationSelected(street, building) {
      
      this.$axios.get(this.map.getCoords, {
        
        params: {
          id: street.id,
          number: building
        }

      }).then(r => {
        
        if( r.data && r.data.centroid ) {
          
          this.map.center.street_id = street.id
          this.map.center.house_number = building
          this.map.center.address = `${street.name}, ${building}`
          this.map.center.lat = r.data.centroid.lat
          this.map.center.lon = r.data.centroid.lon

          this.makeOrder()

        }        
      })
    },

    makeOrder() {

      this.search_showen = false
      this.map.wrapper.setCenter([
        this.map.center.lon,
        this.map.center.lat,
      ])

      console.log(this.map.center)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  #top-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #101423;
    padding-top: 30px;
    z-index: 199;
    transition: top .5s;
  }

  #top-panel.hidden {
    top: -150px;
  }

  #map{
    position: absolute;
    width: 100%;
    left:0;
    top: 0;
  }
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
    transition: opacity .3s;
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
    top: 20px;
    left: 50%;
  }

  .address {
    position: relative;
    top: 0;
    left: -50%;
    display: table;
    padding: 7px 10px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 20px;
    margin: 10px auto;
    transition: all 0.5s;
    z-index: 199;
    text-shadow: 2px 2px 5px #000;
    box-shadow: 0px 3px 22px -11px #fff;
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
    box-shadow: 0px 0px 22px -11px #fff;
  }

  .search.full{
    top: 4%;
    left: 2%;
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
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
    left: 0;
    right: 0;
    padding: 10px 15px;
    z-index: 299;
    color: #000;
    opacity: 1;
  }

  .apear-feaded-enter-active{
    transition: opacity .5s;
    transition-delay: 0.5s
  }

  .apear-feaded-enter, .apear-feaded-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .streets-li-enter-active {
    animation: bounce-in .5s;
  }
  .streets-li-leave-active {
    animation: bounce-in .5s reverse;
  }
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }

  .street-address{
    text-align: left; 
    padding: 7px 5px;
    border-bottom: 1px solid rgba(16, 20, 35, 0.1);
  }

  .street-name{
    font-size: 18px;
  }

  .street-city{
    margin-left: 7px;
    color: #6174b8;
  }

  .row.under-abs-search {
    overflow: scroll;
  }


  #bottom-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #101423;
    box-shadow: 0px -3px 10px 0px #101423;
  }

  #bottom-panel > ul{
    padding: 0;
    margin: 0;
  }

  #bottom-panel > ul > li{
    display: inline-block;
    margin: 0 10px;
  }

  #bottom-panel > ul > li > a{
    display: block;
    padding: 10px;
    color: #ffffff;
    border-top: 1px solid transparent;
  }

  #bottom-panel > ul > li > a.active{
    border-top-color: #1de4ae;
    color: #1de4ae;
  }
</style>
