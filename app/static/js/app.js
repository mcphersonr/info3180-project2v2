/* Add your Application JavaScript */

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container">
      <img class="mr-auto photogramicon"  v-bind:src="userphoto"/>
      <a class="navbar-brand font text-white">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="row collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore<span class="sr-only">(current)</span></router-link>
          </li>
           <li class="nav-item active">
            <router-link class="nav-link" to="/users/0">My Profile<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
        </div>
      </div>
    </nav>
    `,watch: {
        '$route' (to, fom){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.userid=localStorage.getItem('userid');
        if (localStorage.getItem('userphoto')){
            self.userphoto=localStorage.getItem('userphoto');
        };
    },
    data: function() {
        return {
            user: [],
            userid:'',
            userphoto:'/static/images/instagram.png',
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user= localStorage.getItem('token');
            self.userid=localStorage.getItem('userid');
            if (localStorage.getItem('userphoto')){
                self.userphoto=localStorage.getItem('userphoto');
            }
            else{
                self.userphoto='/static/images/instagram.png';  
            }
            
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer class="page-footer bg-primary font-small pt-4 mt-4">
        <div class="footer-copyright py-3 text-center">
            <p>Copyright &copy; Photogram.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
   <div class="container contentdisplay" v-if="usertoken=='Not logged in'">
        <div class="row">
            <div class="col-md-5 col-sm-10">
                <img class="homeimage img-thumbnail" v-bind:src="homephoto"/>
            </div>
            <div class=" shadow jumbotron homedisplay col-md-5 col-sm-10">
                <div class="row homelogo">
                    <img class="iconimage" v-bind:src="iconphoto"/><h3 class="font homelogoname">Photogram</h3>
                </div>
                <hr>
                <p class="lead">Share photos of your favourite moments with friends, family and the world</p>
                </br>
                <router-link class="btn btn-success col-lg-5 col-md-3" to="/register">Register</router-link>
                <router-link class="btn btn-primary col-lg-5 col-md-3" to="/login">Login</router-link>
            </div>
        </div>
    </div>
    <div class="row regular" v-else>
        <div class="jumbotron shadow">
            <h3 class="align-middle">You are already logged in</h3>
        </div>
    </div>
   `,
    created: function(){
        let self = this;
        if (localStorage.getItem('token')){
            self.usertoken=localStorage.getItem('token');
        }
        
    },
    data: function() {
       return {
           usertoken:'Not logged in',
           iconphoto:'/static/images/instagram.png',
           homephoto:'/static/images/download.jpg',
       }
    }
});

const Register=Vue.component('register',{
    template:`<div v-if="usertoken=='Not logged in'" class="row container regular">
                    <p class="lead col-md-12 formlabel">Register</p>
                    <div class="jumbotron shadow">
                        <ul class="list-group">
                            <li class="col-md-12 list-group-item list-group-item-danger" v-for="message in error" v-if="error.length > 1">
                                {{message}}
                            </li>
                        </ul>
                    <form class="col-md-12" id="registerform" @submit.prevent="register" method="POST" enctype="multipart/form-data">
                        <label class="input-group">Username</label>
                        <input class="form-control" type="text" name="username">
                        <br>
                        
                        <label class="input-group">Password</label>
                        <input class="form-control" type="password" name="password">
                        <br>
                        
                        <label class="input-group">Retype-Password</label>
                        <input class="form-control" type="password" name="confirmpassword">
                        <br>
                        
                        <label class="input-group">Firstname</label>
                        <input class="form-control"  type="text" name="fname">
                        <br>
                        
                        <label class="input-group">Lastname</label>
                        <input class="form-control" type="text" name="lname">
                        <br>
                        
                        <label class="input-group">Email</label>
                        <input class="form-control"  type="email" name="email">
                        <br>
                        <label class="input-group">Location</label>
                        <input class="form-control"  type="text" name="location">
                        <br>
                        
                        <label class="input-group">Biography</label>
                        <textarea class="form-control col-md" id="desc" rows="5" name="biography"></textarea>
                        <br>
                        
                        <label class="input-group">Photo</label>
                        <input class="btn btn-default btn-file" type="file"  name="profile_photo"/>
                        
                        <br><br>
                        
                        <button class="btn btn-success col-md-12" type="submit">Register</button>
                        <br><br>
                    </form>
                </div>   
            </div>
        <div class="row regular" v-else>
            <div class="jumbotron shadow">
                <h3 class="align-middle">You are already a user</h3>
            </div>
        </div>`
, created:function(){
    let self = this;
        if (localStorage.getItem('token')){
            self.usertoken=localStorage.getItem('token');
        }
},data: function(){
    return {
        response:[],
        error:[],
        usertoken:'Not logged in',
    }
},methods:{
    register: function(){
        let self = this;
        let registerform = document.getElementById('registerform');
        let form_data = new FormData(registerform);
        fetch("/api/users/register", { 
            method: 'POST', 
            body: form_data,
            headers: {
                    'X-CSRFToken': token
                },
            credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                if(jsonResponse.response){
                    alert("Account created "+jsonResponse.response["0"]["username"]+" Please login.")
                    self.$router.push('/login');
                } 
                else{     
                    self.error=jsonResponse.errors["0"]["error"];  
                }
            
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
});

const Login =Vue.component('login',{
    template:`<div v-if="usertoken=='Not logged in'" class="row container regular">
                    <p class=" col-md-12 lead formlabel"> Login</p>
                    <div class="jumbotron shadow">
                        <ul class="list-group">
                            <li v-for="error in error" class="list-group-item list-group-item-danger">
                                {{error}} <br>
                            </li>
                        </ul>
                        <form class="col-md-12" id="loginform" method="POST" @submit.prevent="login">
                            <label class="input-group">Username</label>
                            <input class="form-control" type="text" name="username">
                            <br><br>
                            <label class="input-group" >Password</label>
                            <input class="form-control" type="password" name="password"> 
                            <br><br>
                            <button class="btn btn-success col-md-12" type="submit">Login</button>
                        </form>
                    </div>
                </div><div class="row regular" v-else><div class="jumbotron shadow"><h3 class="align-middle">You are already logged in</h3></div></div>`
,created:function(){
    let self = this;
        if (localStorage.getItem('token')){
            self.usertoken=localStorage.getItem('token');
        }
}, data: function() {
    return {
        response:[],
        error:[],
        usertoken:'Not logged in',
    }
    
}, methods:{
    login: function(){
        let self = this;
        let loginform = document.getElementById('loginform');
        let form_data = new FormData(loginform);
        fetch("/api/auth/login", { 
            method: 'POST', 
            body: form_data,
            headers: {
                    'X-CSRFToken': token
                },
            credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                if(jsonResponse.errors){
                    self.error = jsonResponse.errors['0']['error'];
                }
                else{
                    let jwt_token = jsonResponse.response["0"].token;
                    let userid=jsonResponse.response["0"].userid;
                    let userphoto=jsonResponse.response["0"].userphoto;
                    localStorage.setItem('token', jwt_token);
                    localStorage.setItem('userid',userid);
                    localStorage.setItem('userphoto',userphoto);
                    alert(jsonResponse.response["0"].message);
                    self.$router.push({path:`/users/${0}`})
                }
                
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
    
});

const Logout=Vue.component('logout',{
    template:`<div class="row container regular" v-if="usertoken !=''">
    <div class="jumbotron shadow">
    <p class="lead">Are you sure you want to logout</p>
    <form id="logout" @submit.prevent="logout">
    <button class="btn btn-primary col-md-12" type="submit" >Logout</button>
    </form>
    </div>
    </div>
    <div class="row regular" v-else><div class="jumbotron shadow"><h3 class="align-middle">You are not logged in</h3></div></div>
    `,created:function(){
            let self = this;
            if(localStorage.getItem('token')!==null){
                self.usertoken=localStorage.getItem('token');   
            }
        },
    data:function(){
        return {
            response:[],
            usertoken:''
        }
    },methods:{
        logout: function(){
        if (localStorage.getItem('token')!==null){
            let self = this;
            self.usertoken=localStorage.getItem('token');
            let logoutform = document.getElementById('logout');
            let form_data = new FormData(logoutform);
            fetch("/api/auth/logout", { 
                method: 'GET',
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'X-CSRFToken': token
                    },
                credentials: 'same-origin'
                
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    if(jsonResponse.response){
                        localStorage.removeItem('token');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('userphoto');
                        alert(jsonResponse.response["0"].message);
                         self.$router.push('/')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }    
    }
})

const AddPost=Vue.component('addpost',{
    template:`
    <div class="row container regular" v-if="usertoken !== ''">
        <p class=" col-md-12 lead formlabel">New Post</p>
        <div class="jumbotron shadow">
            <ul class="list-group">
                <li v-for="error in error" class="list-group-item list-group-item-danger">
                    {{error}}
                </li>
            </ul>
            <form id="postform"  @submit.prevent="uploadPost" method="POST" enctype="multipart/form-data">
                <label class="input-group lead" for="photo">Photo</label>
                <input class="form-control-file" type="file"  name="photo"/>
                <br>
                <br>
                <label class="input-group lead" for="caption">Caption</label>
                <textarea class="form-control" rows="3" placeholder="Write a caption..." id="caption" name="caption"></textarea>
                <br><br>
                <button class="btn btn-success col-md-12" type="submit">Submit</button>
            </form>
        </div>
    </div>
    <div class="row" v-else>
        <div class="jumbotron">
            <h3>You are not logged in</h3>
        </div>
    </div>`,
        created:function(){
            let self = this;
            if(localStorage.getItem('token')!==null){
                self.usertoken=localStorage.getItem('token');   
            }
        },
    data:function(){
        return {
            response:[],
            error:[],
            usertoken:''
        }
    },methods: {
        uploadPost: function () {
            let self = this;
            let uploadForm = document.getElementById('postform');
            let form_data = new FormData(uploadForm);
            fetch("/api/users/0/posts", { 
            method: 'POST',
            body: form_data,
            headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'X-CSRFToken': token
                },
            credentials: 'same-origin'
            
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                 if(jsonResponse.response){
                    alert(jsonResponse.response["0"].message);
                    self.$router.push({path:`/users/${0}`})
                } 
                else{     
                    self.error=jsonResponse.errors["0"]["error"];  
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
    
});

const Explorer=Vue.component('Allposts',{
template:`
            <div class="container explorer" v-if="usertoken !=''">
             <div class="row">
                <div v-if="posts.length>=1" class="row col-md-7 float-left">
                    <div class="jumbotron shadow" style="width:90%" v-for="post in posts">
                        <div class="row userimage">
                            <img class="postuserphoto" v-bind:src="post.userphoto"> <h5 class="align-middle" >{{post.username}}</h5>
                        </div>
                        <br>
                        <div class="row col-md-12">
                            <img class="postimages img-thumbnail shadow" v-bind:src="post.photo"/>
                        </div>
                        <br>
                        <div class="row col-md-12">
                            <p class="lead postcaption">{{post.caption}}</p>    
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-1" :id="'likebutton'+post.id" v-if="post.likebyuser=='No'">
                                    <img :id=post.id v-on:click="like(post.id)" class="likebutton" v-bind:src="'static/images/tolike.png'" />
                            </div>
                            <div class="col-md-1" v-else>
                                    <img class="likebutton" v-bind:src="'static/images/redheart.png'" />
                            </div>
                            <div class="col-md-5">
                                <p class="likename"> <span :id="'like'+post.id">{{post.likes}}</span> Likes</p>
                            </div>
                            <div class="col-md-5 postdate">
                                <p>{{post.created_on}}</p></div>
                            </div>
                            
                        </div>
                </div>
                <div class="jumbotron" v-else>
                    <h5> No Posts</h5>
                </div>
                <div class="col-md-5 float-right">
                    <router-link class="btn btn-primary col-md-6" to="/postnew">New Post</router-link>
                </div>
            </div>
        </div>
        <div class="row regular" v-else>
            <div class="jumbotron shadow">
                <h3 class="align-middle">You are not logged in</h3>
            </div>
        </div>`,
        created: function () {
            let self = this;
            if(localStorage.getItem('token')!==null){
                self.usertoken=localStorage.getItem('token');
                console.log(self.usertoken);
                fetch("/api/posts", { 
                method: 'GET',
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'X-CSRFToken': token
                    },
                credentials: 'same-origin'
                
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
        
                    self.posts=jsonResponse.response['0']['posts'];
                    console.log(self.posts);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        data:function(){
            return {
                response:[],
                posts:[],
                error:[],
                usertoken:''
            }
        },
        methods:{
            like:function(postid){
                let self= this;
                let likevalue=document.getElementById('like'+postid).innerHTML;
                likevalue=parseInt(likevalue)+1;
                fetch("/api/posts/"+postid+"/like", { 
                    method: 'POST',
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonResponse) {
                        if (jsonResponse.response){
                            alert(jsonResponse.response['0']['message']);
                            document.getElementById('like'+postid).innerHTML=likevalue;
                            like=document.getElementById(postid);
                            document.getElementById('likebutton'+postid).removeChild(like);
                            newicon=document.createElement('IMG');
                            newicon.setAttribute('src','static/images/redheart.png');
                            newicon.classList.add('likebutton');
                            document.getElementById('likebutton'+postid).appendChild(newicon);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
                
        }
});

const UserPost=Vue.component('Userposts',{
template:`<div v-if="usertoken!==''">
            <div v-if="error ===''">
                <div id="profile" class="container shadow jumbotron col-md-12" >
                    <div class="row">
                        <div class="col-lg-2 col-md-8"> 
                            <img class="displayphoto" v-bind:src="userinfo.photo" />
                        </div>
                        <div class="col-lg-10">
                            <div class="col-lg-6 col-md-8 float-left">
                                <h4>{{userinfo.fname}}<span> {{userinfo.lname}}</span></h4>
                                <br>
                                <p class="lead">{{userinfo.location}} <br>Member since {{userinfo.joined}}</p>
                                <p class="lead">{{userinfo.bio}}</p> 
                            </div>
                            <div class="row col-lg-6 col-md-3">
                                <div class="col-lg-4 col-md-2 posts">
                                    <h4><span class="colors">{{numposts}}</span></br>Posts</h4>
                                </div>
                                <div class="col-lg-2 col-md-2 follow">
                                    <h4><span id="followers" class="colors">{{follows}}</span></br>Followers</h4>
                                </div>
                            </div>
                            <div class="col-lg-8 float-right followbutton col-md-6">
                                <form method="POST" @submit.prevent="follow">
                                    <input  id='userid' type="hidden" :value=userinfo.id >
                                    <div v-if="toshow=='Yes'">
                                        <button id='follow' class="btn btn-primary col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                    <div v-else>
                                        <button disabled class="btn btn-success col-lg-12 col-md-6" >Follow</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="postdisplay" class="container">
                    
                </div>
            </div>
            <div class="jumbotron" v-else>
                <h1>User Doesn't exist</h1>
            </div>
        </div>
        <div class="row regular" v-else>
            <div class="jumbotron shadow">
                <h3 class="align-middle">You are not logged in</h3>
            </div>
        </div>`,
        created: function () {
            if(localStorage.getItem('token')!==null){
                let self = this;
                self.usertoken=localStorage.getItem('token');
                fetch("/api/users/"+this.$route.params.user_id+"/posts", { 
                method: 'GET',
                headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'X-CSRFToken': token
                    },
                credentials: 'same-origin'
                
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    if (jsonResponse.response){
                        self.posts=jsonResponse.response['0']['posts']['0'];
                        self.rows=Math.ceil((self.posts.length/self.columns));
                        self.numposts=jsonResponse.response['0']['numposts'];
                        self.follows=jsonResponse.response['0']['follows'];
                        self.userinfo=jsonResponse.response['0']['userinfo'];
                        
                        if(self.posts.length < 1){
                            nopost=document.createElement('DIV');
                            h3=document.createElement('H3');
                            h3.appendChild(document.createTextNode('No post Yet'));
                            nopost.appendChild(h3);
                            postcontainer=document.getElementById('postdisplay');
                            postdisplay.appendChild(nopost);
                            
                            
                        }
                        else{
                            postcontainer=document.getElementById('postdisplay');
                            for(i=0;i<self.posts.length+1;i++){
                                row=document.createElement('DIV');
                                row.classList.add('row');
                                for (m=1;m<self.columns+1;m++){
                                    if(i-1+m<self.posts.length){
                                        picdiv=document.createElement('DIV');
                                        picdiv.classList.add('col-lg-4');
                                        pic=document.createElement('IMG');
                                        pic.setAttribute('src',self.posts[i-1+m]['photo'])
                                        pic.classList.add('postphotos','shadow','img-thumbnail');
                                        picdiv.appendChild(pic);
                                        row.appendChild(picdiv);
                                    }
                                }
                                postcontainer.appendChild(row);
                                postcontainer.appendChild(document.createElement('HR'));
                                i+=self.columns-1;
                            }
                        }
                        
                        if((jsonResponse.response['0']['current']==='No' &&  jsonResponse.response['0']['following']==='No')===true){
                            self.toshow='Yes';
                        }
                        if(jsonResponse.response['0']['current']==='No' && jsonResponse.response['0']['following']==='Yes'){
                                self.isfollowing='You are already following '+self.userinfo['username'];
                        }
                    }
                    else{
                        self.error=jsonResponse.error['error'];
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            
        },
        data:function(){
            return {
                usertoken:'',
                posts:[],
                follows:0,
                numposts:0,
                userinfo:[],
                isfollowing:'',
                error:'',
                toshow:'',
                columns:3,
                rows:0,
                limits:[0],
            }
        },methods:{
            follow:function(){
                let self= this;
                let followid=document.getElementById('userid').value;
                let updatefollows=document.getElementById('followers').innerHTML;
                updatefollows=parseInt(updatefollows)+1;
                fetch("/api/users/"+followid+"/follow", { 
                    method: 'POST',
                    headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                            'X-CSRFToken': token
                        },
                    credentials: 'same-origin'
                    
                    })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonResponse) {
                        if (jsonResponse.response){
                            alert(jsonResponse.response['message']);
                            document.getElementById('followers').innerHTML=updatefollows;
                            document.getElementById('follow').disabled=true;
                            document.getElementById('follow').classList.remove('btn-primary');
                            document.getElementById('follow').classList.add('btn-success');
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
                
        }
})
// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path:"/login",component: Login },
        { path:"/postnew", component:AddPost},
        { path:"/register", component:Register},
        { path:"/logout",component:Logout},
        { path:"/explore",component:Explorer},
        { path:"/users/:user_id",component:UserPost}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});