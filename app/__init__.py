from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect


UPLOAD_FOLDER = './app/static/uploads'
TOKEN_SECRET = 'Thisissecret'

app = Flask(__name__)
app.config['SECRET_KEY'] = "change this to be a more random key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://gupeugdvhfiaez:4b4fa9ed080f66d23ac9a6be983b25b03dd4f957dcd66b9087fc5d261c950b5e@ec2-54-243-213-188.compute-1.amazonaws.com:5432/dcg5afs9a5nt4i'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
csrf = CSRFProtect(app)
db = SQLAlchemy(app)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
filefolder = app.config['UPLOAD_FOLDER']
token_key = app.config['TOKEN_SECRET']
app.debug= True
from app import views