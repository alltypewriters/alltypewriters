// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '302056836913512', // your App ID
        'clientSecret'  : '860b216641db816828ade3e5d89d6c0a', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },
     'googleAuth' : {
        'clientID'      : '810849868105-p3640f6pakrgonli7tvoq3rsmdgtpi3b.apps.googleusercontent.com',
        'clientSecret'  : 'GsKlhffLLgZ0RFMyRsGYiz5N',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};