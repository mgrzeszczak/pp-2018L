#!/usr/bin/env python3

import pickle

import keras
#import matplotlib.pyplot as plt
import time
import numpy as np
import pandas as pd
import unidecode
import re
from sklearn import metrics
from sklearn.model_selection import train_test_split
from ml import models

UNK_TOKEN = '<unk/>'
MAX_LEN = 40
EMBED_DIM = 300


def load_vocab(path):
    with open(path) as f:
        return dict(map(lambda x: (x[1], x[0]), enumerate(f.read().split('\n')[:-1])))


def encode_sentence(sentence, vocab):
    tokens = sentence.split(' ')
    if len(tokens) > MAX_LEN:
        tokens = tokens[:MAX_LEN]
    tokens += [UNK_TOKEN] * (MAX_LEN - len(tokens))
    return list(map(lambda w: vocab[w] if w in vocab else vocab[UNK_TOKEN], tokens))


def prepare_sentence(sentence):
    def preprocess(sentence):
        x = str(sentence).lower()
        x = x.replace(",000,000", "m").replace(",000", "k").replace("′", "'").replace("’", "'") \
            .replace("won't", "will not").replace("cannot", "can not").replace("can't", "can not") \
            .replace("n't", " not").replace("what's", "what is").replace("it's", "it is") \
            .replace("'ve", " have").replace("i'm", "i am").replace("'re", " are") \
            .replace("he's", "he is").replace("she's", "she is").replace("'s", " own") \
            .replace("%", " percent ").replace("₹", " rupee ").replace("$", " dollar ") \
            .replace("€", " euro ").replace("'ll", " will")
        x = re.sub(r"([0-9]+)000000", r"\1m", x)
        x = re.sub(r"([0-9]+)000", r"\1k", x)
        return x

    def remove_repeating_spaces(sentence):
        return re.sub('[ ]{2,}', ' ', sentence)

    def remove_non_alphanumeric(sentence):
        return re.sub('[^0-9a-zA-Z ]+', '', sentence)

    def remove_diacritics(sentence):
        return unidecode.unidecode(sentence)

    return remove_repeating_spaces(remove_non_alphanumeric(remove_diacritics(preprocess(sentence)))).strip().lower()


def _calculate_roc(model, X, y):
    preds = model.predict(X)
    fpr, tpr, thresholds = metrics.roc_curve(y, preds)
    plt.title('True/False positives analysis')
    plt.plot(thresholds, fpr, 'r', label='fpr')
    plt.plot(thresholds, tpr, 'b', label='tpr')
    plt.ylabel('Rate')
    plt.xlabel('Threshold')
    plt.axvline(0.7)
    plt.legend(loc='best')
    plt.show()

    roc_auc = metrics.auc(fpr, tpr)
    plt.title('Receiver Operating Characteristic')
    plt.plot(fpr, tpr, 'b', label='AUC = %0.2f' % roc_auc)
    plt.legend(loc='lower right')
    plt.plot([0, 1], [0, 1], 'r--')
    plt.xlim([0, 1])
    plt.ylim([0, 1])
    plt.ylabel('True Positive Rate')
    plt.xlabel('False Positive Rate')
    plt.show()


def _calculate_stats(y, preds):
    f1 = metrics.f1_score(y, preds)
    acc = metrics.accuracy_score(y, preds)
    recall = metrics.recall_score(y, preds)
    precision = metrics.precision_score(y, preds)
    return f1, acc, recall, precision


def load_model(path):
    return keras.models.load_model(path)

# def main():
#     data = pd.read_csv('data.csv', header=None)
#     vocab = load_vocab('vocab.txt')
#     q1s = np.array(list(map(lambda s: encode_sentence(str(s), vocab), data[[0]].as_matrix().flatten())))
#     q2s = np.array(list(map(lambda s: encode_sentence(str(s), vocab), data[[1]].as_matrix().flatten())))
#     y = data[[2]].as_matrix()
#
#     q1_train, q1_test, q2_train, q2_test, y_train, y_test = train_test_split(q1s, q2s, y)
#     # emb_mat = pickle.load(open('emb.mat.bin', 'rb'))
#     # model = models.lstm(emb_mat, MAX_LEN)
#     #
#     # model.fit([q1_train, q2_train], y_train, batch_size=128, epochs=15,
#     #           validation_data=([q1_test, q2_test], y_test), callbacks=[keras.callbacks.EarlyStopping(patience=5)])
#     # model.save('lstm.h5')
#     model = keras.models.load_model('lstm.h5')
#     # calculate_roc(model, [q1_test, q2_test], y_test)
#     start = time.time()
#     preds = model.predict([q1_test, q2_test])
#     print(f'lstm took {time.time()-start}s')
#
#     with open('lstm-stats.csv', 'w') as f:
#         f.write('threshold,f1,acc,recall,precision\n')
#         for threshold in np.arange(0.3, 0.9, 0.05):
#             f1, acc, recall, precision = calculate_stats(y_test, (preds >= threshold).astype(int))
#             f.write(f'{threshold},{f1},{acc},{recall},{precision}\n')
#
#     model = keras.models.load_model('general.h5')
#     # calculate_roc(model, [q1_test, q2_test], y_test)
#
#     start = time.time()
#     preds = model.predict([q1_test, q2_test])
#     print(f'cnn took {time.time()-start}s')
#
#     with open('cnn-stats.csv', 'w') as f:
#         f.write('threshold,f1,acc,recall,precision\n')
#         for threshold in np.arange(0.3, 0.9, 0.05):
#             f1, acc, recall, precision = calculate_stats(y_test, (preds >= threshold).astype(int))
#             f.write(f'{threshold},{f1},{acc},{recall},{precision}\n')
#
#
# if __name__ == '__main__':
#     main()
