;(function() {


	/**
	 * Place to store API URL or any other CONSTANTS
	 * Usage:
	 *
	 * Inject CONSTANTS service as a dependency and then use like this:
	 * CONSTANTS.API_URL
	 */
  angular
  	.module('boilerplate')
    .constant('CONSTANTS', {
      WISTIA : {
        url: 'https://upload.wistia.com',
        mediaUrl: 'https://api.wistia.com/v1/medias.json',
        mediaActionUrl: 'https://api.wistia.com/v1/medias/',
        embedUrl: 'https://fast.wistia.net/embed/iframe/',
        password: '65d7f72fc815f2a9ed12bb4384273c5e42941f17b4fffd4dcc98e87f6f9a5710',
        namePrefix: 'arav_',
        projectId: 'z31h1oxlj0'
      }
    });


})();
