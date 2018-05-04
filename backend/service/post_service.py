import numpy as np
from ml.utils import load_model
from ml.utils import load_vocab
from ml.utils import encode_sentence
from ml.utils import prepare_sentence
from nltk import sent_tokenize

THRESHOLD = 0.65


class PostService:
    def __init__(self, path_to_model, path_to_vocab):
        self.model = load_model(path_to_model)
        self.vocab = load_vocab(path_to_vocab)

    def __encode(self, sentence):
        return encode_sentence(prepare_sentence(sentence), self.vocab)

    def analyze(self, data):
        new_post = data['newPost']
        posts = data['posts']

        post_sentences = list(map(lambda x: sent_tokenize(x['content']), posts))

        existing_sentences = []
        for p in post_sentences:
            for s in p:
                existing_sentences.append(s)

        new_post_sentences = sent_tokenize(new_post['content'])

        if len(existing_sentences) > 0:

            encoded_new_post = list(map(self.__encode, new_post_sentences))
            encoded_existing = list(map(self.__encode, existing_sentences))

            x1 = np.array(encoded_new_post * len(existing_sentences))
            x2 = np.repeat(np.array(encoded_existing), len(new_post_sentences), axis=0)

            predictions = self.model.predict([x1, x2])
            res = predictions.flatten()

            results = [res[i * len(new_post_sentences):i * len(new_post_sentences) + len(new_post_sentences)] for i in
                       range(len(existing_sentences))]

            def select_top_score(index, values):
                which = np.argmax(np.array(values))
                return {
                    'content': existing_sentences[index],
                    'similarity': float(values[which]),
                    'matchedSentenceNo': int(which)
                }

            results = list(map(lambda x: select_top_score(x[0], x[1]), enumerate(results)))

            current = 0
            matches = []
            for t in enumerate(post_sentences):
                matches.append({
                    'sentences': results[current:current + len(t[1])],
                    'postId': posts[t[0]]['id']
                })
                current += len(t[1])

            top_3 = sorted(filter(lambda x: max(map(lambda y: y['similarity'], x['sentences'])) > THRESHOLD, matches),
                           key=lambda m: max(map(lambda x: x['similarity'], m['sentences'])), reverse=True)[:3]
        else:
            top_3 = []

        print(top_3)
        return {
            'matches': top_3,
            'postSentences': new_post_sentences
        }