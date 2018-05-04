from flask import Blueprint, request
from service.post_service import PostService
import json
from flask import jsonify

post_blueprint = Blueprint('post', 'post', url_prefix='/api/post')

service = PostService('files/cnn.h5', 'files/vocab.txt')

@post_blueprint.route('/analyze', methods=['POST'])
def analyze_post():
    data = json.loads(request.data)
    print(data)
    return jsonify(service.analyze(data))
