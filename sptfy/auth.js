var accessToken;

$(document).ready(function () {
		console.log("auth.js ready")
        var stateKey = 'spotify_auth_state';
		
		
		function logOut(){
			localStorage.removeItem(stateKey);
			localStorage.removeItem("accessToken");
			localStorage.removeItem("UserName");
			location.reload();
		}
		
		if (localStorage.getItem("accessToken")){
			document.getElementById('userLoggedIn').innerHTML = (localStorage.getItem("UserName") + " <a id='logoutbtn' href='#'>Logout</a>");
			document.getElementById("logoutbtn").addEventListener ("click", logOut, false);
			document.getElementById('userLoggedIn').setAttribute("style", "display:inline-block;margin-left:10%;");
			document.getElementById('login-button').style.display = "none";
			console.log("user logged in");
		}
		
        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }
        /**
         * Generates a random string containing numbers and letters
         * @param  {number} length The length of the string
         * @return {string} The generated string
         */
        function generateRandomString(length) {
          var text = '';
          var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          }
          return text;
        };
        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');
            oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');
        var params = getHashParams();
        var access_token = params.access_token,
            state = params.state,
            storedState = localStorage.getItem(stateKey);
        if (access_token && (state == null || state !== storedState)) {
          alert('There was an error during the authentication');
        } else {
          localStorage.removeItem(stateKey);
          if (access_token) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);
                  $('#login').hide();
                  $('#loggedin').show();
				  //console.log(access_token);
				  accessToken = access_token;
				  localStorage.setItem("accessToken", accessToken);
				  console.log(response.id);
				  localStorage.setItem("UserName", response.id);
                }
            });
          } else {
              $('#login').show();
              $('#loggedin').hide();
          }
          document.getElementById('login-button').addEventListener('click', function() {
            var client_id = 'f6c1ec9bcbf7426fa257999930ec8ee8'; // Your client id
            var redirect_uri = 'http://users.metropolia.fi/~hannest/sptfy/'; // Your redirect uri
            var state = generateRandomString(16);
            localStorage.setItem(stateKey, state);
            var scope = 'user-read-private user-read-email';
            var url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(client_id);
            url += '&scope=' + encodeURIComponent(scope);
            url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
            url += '&state=' + encodeURIComponent(state);
            window.location = url;

			setTimeout(function(){ window.location = "http://users.metropolia.fi/~hannest/sptfy/"; }, 3000);
			}, false);
        }
      });