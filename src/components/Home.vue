<template>
  <div class="hello">
    
    <div class="full-fixed loading row" v-if="!user_data_loaded">

      <h4 class="animated pulse infinite text-white center align-self-center col">Loading ...</h4>

    </div>
    
    <div class="full-fixed row" v-if="user_data_loaded">

      <faded-bg class="col-12" v-bind="faded.client">

      </faded-bg>

      <faded-bg class="col-12" v-bind="faded.driver">

      </faded-bg>

    </div>

  </div>
</template>

<script>
import fadedBg from "../components/custom/faded-bg";
import btn from "../components/custom/btn";

export default {
  name: 'Home',
  components: {
    fadedBg,
    btn
  },
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
      faded:{
        client:{

        },
        driver:{
          
        }
      }
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

<style scoped>

  .loading{
    background: linear-gradient(180deg, #0d7257, #181e35, #080a12);
    background-size: 600% 600%;

    -webkit-animation: AnimationName 10s ease infinite;
    -moz-animation: AnimationName 10s ease infinite;
    animation: AnimationName 10s ease infinite;
  }

  @-webkit-keyframes AnimationName {
      0%{background-position:100% 0%}
      50%{background-position:0% 100%}
      100%{background-position:100% 0%}
  }
  @-moz-keyframes AnimationName {
      0%{background-position:100% 0%}
      50%{background-position:0% 100%}
      100%{background-position:100% 0%}
  }
  @keyframes AnimationName { 
      0%{background-position:100% 0%}
      50%{background-position:0% 100%}
      100%{background-position:100% 0%}
  }

</style>
