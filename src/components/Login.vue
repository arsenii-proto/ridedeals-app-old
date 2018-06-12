<template>
  <div class="login">
    
    <div class="row">
      
      <h5>{{ trans('login.title') }}</h5>
      <p v-if="!number_sended" class="subtitle">{{ trans('login.phone.title') }}</p>
      <p v-if="number_sended" class="subtitle">{{ trans('login.code.title') }}</p>

      <div class="col s12 hold-wrapper">

        <div v-if="!number_sended" class="col s3 hold country">
          <h5>{{ country_code }}</h5>
        </div>

        <div v-if="!number_sended" class="col s1"></div>
        <div v-if="!number_sended" class="col s8 hold number">
          <h5>{{ phone_number || '&nbsp;' }}</h5>
        </div>


        <div v-if="number_sended" class="col s3"></div>
        <div v-if="number_sended" class="col s6 hold number">
          <h5>{{ code_number || '&nbsp;' }}</h5>
        </div>

      </div>

    </div>

    <div class="row hold-wrapper">
      
      <div class="row">

        <div class="col s4">
          <v-touch @tap="applyNumber('1')">
            <a class="number-link"> 1 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('2')">
            <a class="number-link"> 2 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('3')">
            <a class="number-link"> 3 </a>
          </v-touch>
        </div>

      </div>

      <div class="row">

        <div class="col s4">
          <v-touch @tap="applyNumber('4')">
            <a class="number-link"> 4 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('5')">
            <a class="number-link"> 5 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('6')">
            <a class="number-link"> 6 </a>
          </v-touch>
        </div>

      </div>

      <div class="row">

        <div class="col s4">
          <v-touch @tap="applyNumber('7')">
            <a class="number-link"> 7 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('8')">
            <a class="number-link"> 8 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('9')">
            <a class="number-link"> 9 </a>
          </v-touch>
        </div>

      </div>

      <div class="row">

        <div class="col s4"></div>
        <div class="col s4">
          <v-touch @tap="applyNumber('0')">
            <a class="number-link"> 0 </a>
          </v-touch>
        </div>
        <div class="col s4">
          <v-touch @tap="applyNumber('C')">
            <a class="number-link"> C </a>
          </v-touch>
        </div>

      </div>

      <div class="row">
  
        <div class="col s12">
            <v-touch @tap="sendPhoneNumber">
              <a v-if="!number_sended" v-bind:class="{ enabled: phone_valid }" class="number-link send-btn"> {{ trans('login.phone.btn') }} </a>
            </v-touch>
            <v-touch @tap="sendCodeNumber">
              <a v-if="number_sended" v-bind:class="{ enabled: code_valid }" class="number-link send-btn"> {{ trans('login.code.btn') }} </a>
            </v-touch>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {

    return {

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hold-wrapper {
  padding: 40px 40px 0;  
}

.subtitle {
  padding: 10px 30px;
}

.hold {
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
}

.hold > h5 {
  margin: 0
}

.number-link {
  display: inline-block;
  width: 100%;
  color: inherit;
  font-size: 20px;
  line-height: 40px;
}

.number-link.send-btn {
  opacity: 0.3;
  transition: opacity 0.5s;
}

.number-link.send-btn.enabled {
  opacity: 1;
}

</style>
