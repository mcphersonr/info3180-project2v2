"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db, filefolder,login_manager
from flask import render_template, request, url_for ,redirect,flash,jsonify
from flask_login import login_user, logout_user, current_user, login_required
from forms import LoginForm, PostForm, RegisterForm
from models import Users, Posts, Follows, Likes
from werkzeug.utils import secure_filename
import os
import datetime
###
# Routing for your application.
###




# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)

@app.route("/api/users/register",methods=["POST"])
def register():
    form=RegisterForm()
    if request.method=="POST" and form.validate_on_submit():
        if form.password.data!=form.confirmpassword.data:
            return jsonify (response={'message':'Passwords do not match'})
    l
        emailtest=Users.query.filter_by(email=form.email.data).first()
        if usernametest is not None or emailtest is not None:
            if usernametest is not None:
                return jsonify(response=[{'message':'Username not available. Please enter a different username'}])
            if emailtest is not None:
                return jsonify(response=[{'message':'Email not available. Please use a different email address'}])
        else:
            fileupd=form.profile_photo.data
            filename=secure_filename(fileupd.filename)
            created=datetime.datetime.now()
            user=Users(form.fname.data,form.lname.data,form.username.data,form.email.data,form.password.data,form.location.data,form.biography.data,filename,created)
            db.session.add(user)
            db.session.commit()
            fileupd.save(os.path.join(filefolder,filename))
            usertest=Users.query.filter_by(username=form.username.data).first()
            if usertest is not None:
                return jsonify(response=[{'message':'Your user account was successfully created'}])
            else:
                return jsonify(response=[{'message':'Your account was not added. Please try again'}])
    error=[{'error':form_errors(form)}]
    return jsonify(errors=error)
    
@app.route("/api/users/<int:user_id>/posts",methods=["GET","POST"])
def addpost(user_id):
    form=PostForm()
    if request.method=="GET":
        posts=Posts.query.filter_by(user_id=user_id).all()
        return jsonify(response={'posts':convertposts(posts)})
    
    if request.method=="POST" and form.validate_on_submit():
        image=form.photo.data
        filename=secure_filename(image.filename)
        created=datetime.datetime.now()
        post=Posts(current_user.id,filename,form.caption.data,created)
        db.session.add(post)
        db.session.commit()
        image.save(os.path.join(filefolder,filename))
        return jsonify(response=[{'message':'Post added successfully'}])
    return jsonify(errors=[{'error':form_errors(form)}])
    
@app.route("/api/users/<int:user_id>/follow",methods=["POST"])
def follow(user_id):
    if request.method=="POST":
        follow=Follows(user_id,current_user.id)
        db.session.add(follow)
        db.session.commit()
        user=Users.query.filter_by(id=user_id).first()
        return jsonify(response=[{'message':'You are now following '+user.username}])
    
@app.route("/api/posts",methods=["GET"])
def getpost():
    posts=Posts.query.order_by(Posts.created_on).all()
    return jsonify(response=[{'posts':convertposts(posts)}])
        
@app.route("/api/posts/<int:post_id>/like",methods=["POST"])
def likepost(post_id):
    if request.method=="POST":
        like=Likes(current_user.id,post_id)
        db.session.add(like)
        db.session.commit()
        count=countlikes(post_id)
        return jsonify(response=[{'message':'Post Liked','Likes':count}])
        
@app.route("/api/auth/login", methods=["POST"])
def login():
    if current_user.is_authenticated:
        return jsonify(response=[{'message':'User already logged in.'}])
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        # change this to actually validate the entire form submission
        # and not just one field
        username=form.username.data
        password=form.password.data
        
        user=Users.query.filter_by(username=username,password=password).first()
            # Get the username and password values from the form.
        if user is not None:
            login_user(user)
            return jsonify(response=[{'message':'Logged in successfully.'}])
        else:
            return jsonify(response=[{'message':'Password and user name does not match our records.'}])
    return jsonify(errors=[{'error':form_errors(form)}])



@app.route("/api/auth/logout",methods=["GET"])
@login_required
def logout():
    logout_user()
    return jsonify(response=[{'message':'User successfully logged out.'}])
    
# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###

def convertposts(posts):
    newposts=[]
    for i in range (0,len(posts)):
        x={
        'id':posts[i].id,
        'user_id':posts[i].user_id,
        'photo':posts[i].photo,
        'caption':posts[i].caption,
        'created_on':posts[i].created_on,
        'likes':countlikes(posts[i].id)}
        newposts.append(x)
    return newposts
        
def countlikes(post_id):
    count=Likes.query.filter_by(post_id=post_id).all()
    return len(count)
    


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
