
$(document).ready(function() {
       $("#vote").hide();
       });
   window.fbAsyncInit = function() {
  FB.init({
    appId      : '540117752714488', // App ID
    channelUrl : '//https://127.0.0.1:8000/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below
  // will be handled.
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs.
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they
      // have logged in to the app.
      token = response.authResponse.accessToken;
      testAPI();
      getUser();
      getrandom();

      //getFriends();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login()
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook.
      // The same caveats as above apply to the FB.login() call here.
      FB.login();
    }
  });
  };

  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful.
  // This testAPI() function is only called in those cases.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');
    });
  }

  function getUser() {
    FB.api('/me', function(response) {
      $("h2").append('Good to see you, ' + response.name + '.');
      $("#voter").attr("value",response.id);

    });
  }


  function getFriends() {
    FB.api('/me/friends', function(response) {
        friendCount = response.data.length;
        $("h2").append('<br/>'+'You have ' + friendCount+ ' friends');
        if(response.data) {
                var a =[];
                var maxarray = [];
                var namearray = [];
                var idarray = [];
                i=0;
            $.each(response.data,function(index,friend) {
                FB.api('/me/mutualfriends/'+friend.id, function(mutualfriends) {
                    i++;

                    a.push(mutualfriends.data.length);
                    maxarray.push(Math.max.apply(Math, a));
                    namearray.push(friend.name);
                    idarray.push(friend.id);

                    var maxmutual = Math.max.apply(Math, a);


                    if (maxmutual == mutualfriends.data.length)
                    {maxfriendname = friend.name;
                     maxfriendid = friend.id;
                    }



                    if (i == friendCount )
                    {   $("#div1").append(maxfriendname + ' (' + maxmutual + ')');
                        $("#div1").append('<br/><img src="http://graph.facebook.com/' + maxfriendid + '/picture?width=200&height=200" />');
                        $("#friend1").attr("value",maxfriendid);
                        $("#contestant1").attr("value",maxfriendid);
                        $('label[for=friend1]').html(maxfriendname);

                        for (j=friendCount-1;j>0;j--){
                            if (maxarray[j]!=maxmutual)
                            {   nextmaxmutual = maxarray[j];
                                break;
                            }
                        }

                        for (k=0;k<friendCount;k++){
                            if (nextmaxmutual == a[k]){
                                nextmaxfriendname = namearray[k];
                                nextmaxfriendid = idarray [k];
                                break;
                            }
                        }
                        $("#div2").append(nextmaxfriendname + ' (' + nextmaxmutual + ')');
                        $("#div2").append('<br/><img src="http://graph.facebook.com/' + nextmaxfriendid + '/picture?width=200&height=200" />');
                        $("#friend2").attr("value",nextmaxfriendid);
                        $("#contestant2").attr("value",nextmaxfriendid);
                        $('label[for=friend2]').html(nextmaxfriendname);

                    }
                });
            });
            } else {
            console.log("Error!");
        }
    });
  }

   function getrandom () {
        FB.api('/me/friends', function(response) {
        friendCount = response.data.length;
        $("h2").append('<br/>'+'You have ' + friendCount+ ' friends');
      });

        FB.api('/fql', {q: "SELECT uid, name FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) ORDER BY rand() limit 2"}, function(response) {
        person1 = response.data[0];
        person2 = response.data[1];
        $("#div1").append(person1.name);
        $("#div1").append('<br/><img src="http://graph.facebook.com/' + person1.uid + '/picture?width=200&height=200" />');
        $("#friend1").attr("value",person1.uid);
        $("#contestant1").attr("value",person1.uid);
        $('label[for=friend1]').html(person1.name);
        $("#div2").append(person2.name);
        $("#div2").append('<br/><img src="http://graph.facebook.com/' + person2.uid + '/picture?width=200&height=200" />');
        $("#friend2").attr("value",person2.uid);
        $("#contestant2").attr("value",person2.uid);
        $('label[for=friend2]').html(person2.name);
      });


       $("#vote").show();

   }
