var devEnv = {
    'secretKey': 'hidden-on-purpose',
    'mongoUrl' : 'mongodb://127.0.0.1:27017/restaurantsOnline',
    "gcmSenderId" : 'hidden-on-purpose',
    'facebook': {
        clientID: '224432327913769',
        clientSecret: 'd2f881eabe19469efc9289b928a62329',
        callbackURL: 'https://localhost:3443/users/facebook/callback'
    }
};

var prodDbConnStr = process.env.OPENSHIFT_MONGODB_DB_URL;

var prodEnv = {
    'secretKey': 'hidden-on-purpose',
    'mongoUrl' : prodDbConnStr + 'restaurantson',
    "gcmSenderId" : 'hidden-on-purpose',
    'facebook': {
        clientID: '224432327913769',
        clientSecret: 'd2f881eabe19469efc9289b928a62329',
        callbackURL: 'https://localhost:3443/users/facebook/callback'
    }
};



if (typeof prodDbConnStr === "undefined") {
    //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
    //  allows us to run/test the app locally.
    console.warn('No OPENSHIFT_MONGODB_DB_URL var, using 127.0.0.1');
    module.exports = devEnv;
    
}else {
    console.warn('Using openshift server config OPENSHIFT_MONGODB_DB_URL for db');
    module.exports = prodEnv;
}
