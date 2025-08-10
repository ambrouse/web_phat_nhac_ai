from flask import Flask
# from flask_socketio import SocketIO

# socket = SocketIO(cors_allowed_origins="*", async_mode='eventlet')

def create_app():
    app = Flask(__name__,
                static_folder="assets",           
                template_folder="templates"
                )
    
    from  .routes import main
    app.register_blueprint(main)

    # socket.init_app(app)

    return app