
function Stiller( stiller ){

    

}


export const StillerService = {
    install: function (Vue, options) {
        
        if( window[ process.env.STILLER_PROP ] ){

            var stiller = window[ process.env.STILLER_PROP ];

            if( stiller.initial && stiller.getProp && stiller.setProp && stiller.callMethod ) {

                Vue.prototype.$stiller = new Stiller(stiller);
            }

        }
    }
};