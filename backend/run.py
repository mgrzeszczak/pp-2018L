#!/usr/bin/env python3
from flask import Flask
from api.post import post_blueprint
from service.post_service import PostService
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(post_blueprint)


def main():
    app.run(host="0.0.0.0", port=8090)


if __name__ == '__main__':
    main()
