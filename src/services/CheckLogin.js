import Vue from 'vue'

export const CheckLogin = {

    firstCheck: true,

    canGo: function () {

        return new Promise((t, c) => {

            const $stiller = Vue.prototype.$stiller

            if ($stiller.firebase.auth.logged) {

                if (this.firstCheck) {

                    this.firstCheck = false

                    $stiller.firebase.firestore.collection('users').doc(
                        $stiller.firebase.auth.loggedUser.phone
                    ).snapshot.on(function (doc) {

                        // if (doc.data.app_token !== $stiller.firebase.app_token) {

                        //     Vue.prototype.$router.push('/not-allowed')
                        // }
                    })
                } 

                return t()

            } else {

                return c()
            }

        })
    }

}