from flask import Blueprint,Response,render_template,request,jsonify
from .service_ import service_camera
import cv2
import numpy as np

main = Blueprint('main', __name__)


@main.route("/camera")
def home():
    return render_template('index.html',message="test index")


@main.route("/")
def index():
    return render_template('home.html',message="Home Page")



@main.route("/thread-ai-funtion", methods=['POST'])
def threadAiFuntion():
    if 'image' not in request.files:
        return jsonify({"funtionAI":0})

    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    return service_camera.detectHand(img=img)



    