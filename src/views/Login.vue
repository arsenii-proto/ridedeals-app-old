<template>
  <faded-bg v-bind="faded" class="login full-fixed p30 m0">
    
    <div class="row">
      <h5 class="col-12 white-text ff-s1 p10 center">
        {{ trans('login.title') }}
      </h5>
    </div>
    
    <div class="row">
      <h6 class="col-12 white-text ff-s4 p10 center">
        <span v-if="!number_sended">
          {{ trans('login.phone.title') }}
        </span>
        <span v-if="number_sended">
          {{ trans('login.code.title') }}
        </span>
      </h6>
    </div>

    <div class="row justify-content-between mt30" v-if="!number_sended">

      <faded-bg class="col-3 theme-blue-text" :opacity="0.2" :pos="'relative'">
        <p class="m0 p5 flow-text ff-s1 fs20">{{ country_code }}</p>
      </faded-bg>

      <faded-bg class="col-8 theme-blue-text" :opacity="0.2" :pos="'relative'">
        <p class="m0 p5 flow-text ff-s1 fs20">{{ phone_number || '&nbsp;' }}</p>
      </faded-bg>

    </div>

    <div class="row justify-content-center mt30" v-if="number_sended">

      <faded-bg class="col-6 theme-blue-text" :opacity="0.2" :pos="'relative'">
        <p class="m0 p5 flow-text ff-s1 fs20">{{ code_number || '&nbsp;' }}</p>
      </faded-bg>

    </div>

    <div class="absolute-btns">
      <div class="row justify-content-between mt20">

        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('1')">1</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('2')">2</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('3')">3</btn>

      </div>

      <div class="row justify-content-between mt20">

        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('4')">4</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('5')">5</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('6')">6</btn>

      </div>

      <div class="row justify-content-between mt20">

        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('7')">7</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('8')">8</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('9')">9</btn>

      </div>

      <div class="row justify-content-between mt20">

        <btn class="col-3"></btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('0')">0</btn>
        <btn class="col-3 theme faded fs18 ff-s1" @tap="applyNumber('C')">C</btn>

      </div>

      <div class="row justify-content-center mt20">
          
          <btn v-if="!number_sended" class="col theme outline fs16 ff-s1" @tap="sendPhoneNumber" :style="{ opacity: (phone_valid ? 1 : 0.4), transition: 'opacity .3s' }">
            {{ trans('login.phone.btn') }}
          </btn>
          <btn v-if="number_sended" class="col theme outline fs16 ff-s1" @tap="sendCodeNumber" :style="{ opacity: (code_valid ? 1 : 0.4), transition: 'opacity .3s' }">
            {{ trans('login.code.btn') }}
          </btn>

      </div>
    </div>

  </faded-bg>
</template>

<script>

import fadedBg from "../components/custom/faded-bg";
import btn from "../components/custom/btn";

export default {
  name: 'login',
  components: {
    fadedBg,
    btn
  },
  data () {

    return {

      faded:{
        bg: require('@/assets/screen-saver.jpg'),
        fade_bg: 'linear-gradient(130deg, #0d7257 0%, #181e35 51%, #080a12 75%)'
      },

      country_code: '+373',
      number_sended: false,

      phone_number: '',
      phone_regex_not_values: /[^\d]/g,
      phone_regex_match_patern: /^\s*(\d\d?)\s*(\d?\d?)\s*(\d?\d?)\s*(\d?\d?)\s*$/,
      phone_regex_replace_patern: '$1 $2 $3 $4',
      phone_regex_valid: /^\s*(\d\d)\s*(\d\d)\s*(\d\d)\s*(\d\d)\s*$/,
      phone_valid: false,

      code_number: '',
      code_regex_not_values: /[^\d]/g,
      code_regex_match_patern: /^\s*(\d\d?)\s*(\d?\d?)\s*(\d?\d?)\s*$/,
      code_regex_replace_patern: '$1 $2 $3',
      code_regex_valid: /^\s*(\d\d)\s*(\d\d)\s*(\d\d)\s*$/,
      code_valid: false,

    }
  },
  methods: {

    applyNumber(numb) { 
      this[ this.number_sended ? 'addCodeNumber' : 'addPhoneNumber' ]( numb.trim() )
    },

    addPhoneNumber( numb ) {

      var number = this.phone_number.replace(this.phone_regex_not_values, '');

      if( numb === 'C' ) {

        this.phone_number = number.substr(0, number.length-1).replace(this.phone_regex_match_patern, this.phone_regex_replace_patern)

      } else {

        number += numb || '';

        if( this.phone_regex_match_patern.exec( number ) ) {

          this.phone_number = number.replace(this.phone_regex_match_patern, this.phone_regex_replace_patern)
        }
      }

      this.phone_valid = ( this.phone_regex_valid.exec(this.phone_number) !== null )
    },

    addCodeNumber( numb ) {

      var number = this.code_number.replace(this.code_regex_not_values, '');

      if( numb === 'C' ) {

        this.code_number = number.substr(0, number.length-1).replace(this.code_regex_match_patern, this.code_regex_replace_patern)

      } else {

        number += numb || '';

        if( this.code_regex_match_patern.exec( number ) ) {

          this.code_number = number.replace(this.code_regex_match_patern, this.code_regex_replace_patern)
        }
      }

      this.code_valid = ( this.code_regex_valid.exec(this.code_number) !== null )
    },

    sendPhoneNumber() {

      if(! this.phone_valid ) return;

      this.$stiller.firebase.auth.signInWithPhoneNumber({ number: this.country_code + this.phone_number })
        .then(this.repaireUser)
        .catch(error => { this.$router.replace('/not-allowed') })
      
      this.number_sended = true
    },

    sendCodeNumber() {

      if(! this.phone_valid ) return;

      this.$stiller.firebase.auth.signInWithPhoneNumberCode({ code: this.code_number })
        .then(this.repaireUser)
        .catch(error => { this.$router.replace('/not-allowed') })
    },

    repaireUser() {

      const self = this
      const userDocRef = self.$stiller.firebase.firestore.collection('users').doc(
          self.$stiller.firebase.auth.loggedUser.phone
      )
      
      userDocRef.get().then(function (doc) {

        if (! doc.exists) {

          userDocRef.set({

            phone_number: self.$stiller.firebase.auth.loggedUser.phone,
            default_first_name: "Anonymous",
            default_second_name: "Anteater",
            default_profile_png: "https://ssl.gstatic.com/docs/common/profile/anteater_lg.png",
            type: null,
            app_token: self.$stiller.firebase.app_token

          }).then(() => { self.$router.replace('/') })

        } else {

          userDocRef.update({

              app_token: self.$stiller.firebase.app_token

          }).then(() => { self.$router.replace('/') })
        }

      })
    }
  }
}
</script>

<style scoped>

  .absolute-btns{
    padding: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
