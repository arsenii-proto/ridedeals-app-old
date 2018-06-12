<template>
  <div class="hello">
    
    <div v-if="!user_data_loaded" class="row">

      <div class="col s12">
        <p class="flow-text animated rubberBand infinite">
          {{ trans('welcome.loading') }}
        </p>
      </div>

    </div>

    <div v-if="user_data_loaded" class="row">

      <div class="col s3"></div>
      <div class="col s6">
        <img v-bind:src="profile_png" alt="" class="circle responsive-img animated pulse infinite">
        <p class="flow-text animated pulse infinite">
          {{ first_name }}  {{ second_name }}
        </p>
      </div>

      <div class="col s12">

        <h5>{{ trans('welcome.who_are_you') }}</h5>

      </div>

      <div class="col s12" style="margin-top: 40px">

        <div class="col s12">
          <v-touch tag="a" @tap="likeClient" class="choose-btn">{{ trans('welcome.i_am_client') }}</v-touch>
        </div>

        <div class="col s12">
          <v-touch tag="a" @tap="likeDriver" class="choose-btn">{{ trans('welcome.i_am_driver') }}</v-touch>
        </div>

      </div>

    </div>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {

    const userDocRef = this.$stiller.firebase.firestore.collection('users').doc(
      this.$stiller.firebase.auth.loggedUser.phone
    )
    
    userDocRef.get().then((doc) => {

      if( doc.data.type != null ){

        this.$router.replace(

          doc.data.type == "client" ? '/client-dashboard' : "/driver-dashboard"

        )

      } else {

        this.profile_png = doc.data.profile_png || doc.data.default_profile_png
        this.first_name = doc.data.first_name || doc.data.default_first_name
        this.second_name = doc.data.second_name || doc.data.default_second_name
        this.user_data_loaded = true
      }

    })

    return {
      user_data_loaded: false,
      profile_png: null,
      first_name: null,
      second_name: null,
    }
  },
  methods: {
    
    likeClient(){
      
      const userDocRef = this.$stiller.firebase.firestore.collection('users').doc(
        this.$stiller.firebase.auth.loggedUser.phone
      ).update({
        type: "client"
      }).then(() =>  this.$router.replace('/client-dashboard') )
    },
    
    likeDriver(){
      
      const userDocRef = this.$stiller.firebase.firestore.collection('users').doc(
        this.$stiller.firebase.auth.loggedUser.phone
      ).update({
        type: "driver"
      }).then(() =>  this.$router.replace('/driver-dashboard') ) 
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .choose-btn{
    display: inline-block;
    padding: 15px 20px;
    border-radius: 30px;
    margin: 10px 0;
    background: #1de4ae;
    color: #212a49
  }
</style>
