import json


class Post:
    def __init__(self, data):
        self.author = data.author
        self.content = data.content
        self.id = data.id
        self.timestamp = data.timestamp

    @staticmethod
    def from_json(json_string):
        return Post(json.loads(json_string))

    def to_json(self):
        return json.dumps(self.__dict__)


class AnalysisResult:
    def __init__(self, post_id, sentence_no, new_post_sentence_no, similarity):
        self.post_id = post_id
        self.sentence_no = sentence_no
        self.new_post_sentence_no = new_post_sentence_no
        self.similarity = similarity

    def to_json(self):
        return json.dumps(self.__dict__)
