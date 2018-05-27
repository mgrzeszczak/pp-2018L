#!/usr/bin/env python3
import keras
from keras.layers import Embedding, Conv1D, Input, GlobalAveragePooling1D, Lambda, concatenate, Dense, \
    BatchNormalization, Dropout
from keras.engine import Model
from keras.callbacks import EarlyStopping, ModelCheckpoint
import keras.backend as K
import pandas as pd
import numpy as np
import nltk
from sklearn.model_selection import train_test_split
import math
import fastText
import jsonpickle
from sklearn import metrics
import matplotlib.pyplot as plt

MAX_LEN = 60
EMBED_DIM = 300
PAD_VECTOR = np.array([0.0] * EMBED_DIM)
BATCH_SIZE = 128


def cnn_model(max_len, embedding_size):
    # 1D convolutions that can iterate over the word vectors
    conv1 = Conv1D(filters=128, kernel_size=1,
                   padding='same', activation='relu')
    conv2 = Conv1D(filters=128, kernel_size=2,
                   padding='same', activation='relu')
    conv3 = Conv1D(filters=128, kernel_size=3,
                   padding='same', activation='relu')
    conv4 = Conv1D(filters=128, kernel_size=4,
                   padding='same', activation='relu')
    conv5 = Conv1D(filters=32, kernel_size=5,
                   padding='same', activation='relu')
    conv6 = Conv1D(filters=32, kernel_size=6,
                   padding='same', activation='relu')

    # Define inputs
    seq1 = Input(shape=(max_len, embedding_size))
    seq2 = Input(shape=(max_len, embedding_size))

    # Run inputs through embedding
    emb1 = seq1
    emb2 = seq2

    # Run through CONV + GAP layers
    conv1a = conv1(emb1)
    glob1a = GlobalAveragePooling1D()(conv1a)
    conv1b = conv1(emb2)
    glob1b = GlobalAveragePooling1D()(conv1b)

    conv2a = conv2(emb1)
    glob2a = GlobalAveragePooling1D()(conv2a)
    conv2b = conv2(emb2)
    glob2b = GlobalAveragePooling1D()(conv2b)

    conv3a = conv3(emb1)
    glob3a = GlobalAveragePooling1D()(conv3a)
    conv3b = conv3(emb2)
    glob3b = GlobalAveragePooling1D()(conv3b)

    conv4a = conv4(emb1)
    glob4a = GlobalAveragePooling1D()(conv4a)
    conv4b = conv4(emb2)
    glob4b = GlobalAveragePooling1D()(conv4b)

    conv5a = conv5(emb1)
    glob5a = GlobalAveragePooling1D()(conv5a)
    conv5b = conv5(emb2)
    glob5b = GlobalAveragePooling1D()(conv5b)

    conv6a = conv6(emb1)
    glob6a = GlobalAveragePooling1D()(conv6a)
    conv6b = conv6(emb2)
    glob6b = GlobalAveragePooling1D()(conv6b)

    mergea = concatenate([glob1a, glob2a, glob3a, glob4a, glob5a, glob6a])
    mergeb = concatenate([glob1b, glob2b, glob3b, glob4b, glob5b, glob6b])

    diff = Lambda(lambda x: K.abs(
        x[0] - x[1]), output_shape=(4 * 128 + 2 * 32,))([mergea, mergeb])
    mul = Lambda(lambda x: x[0] * x[1],
                 output_shape=(4 * 128 + 2 * 32,))([mergea, mergeb])

    merge = concatenate([diff, mul])

    x = Dropout(0.2)(merge)
    x = BatchNormalization()(x)
    x = Dense(300, activation='relu')(x)

    x = Dropout(0.2)(x)
    x = BatchNormalization()(x)
    pred = Dense(1, activation='sigmoid')(x)

    model = Model(inputs=[seq1, seq2], outputs=pred)
    model.compile(loss='binary_crossentropy',
                  optimizer='adam', metrics=['acc'])

    return model


def encode_sentence(sentence, ft_model):
    tokens = str(sentence).split(' ')
    embedding = list(map(ft_model.get_word_vector, tokens))
    embedding += [PAD_VECTOR] * (MAX_LEN - len(embedding))
    return np.array(embedding)


def data_generator(x1, x2, y, batch_size, embed_fn):
    size = len(y)
    while True:
        indices = np.random.permutation(size)
        while len(indices) > 0:
            selected = indices[:batch_size]
            indices = indices[batch_size:]
            q1 = np.array(list(map(embed_fn, x1[selected])))
            q2 = np.array(list(map(embed_fn, x2[selected])))
            labels = y[selected]
            yield ([q1, q2], labels)


def plot_roc(y_true, preds):
    fpr, tpr, threshold = metrics.roc_curve(y_true, preds)
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


def load_data(path):
    data = pd.read_csv(path, header=None)
    x1 = data[[0]].as_matrix().flatten()
    x2 = data[[1]].as_matrix().flatten()
    y = data[[2]].as_matrix().flatten()
    return x1, x2, y


def calculate_steps(size, batch_size):
    if size % batch_size == 0:
        return size // batch_size
    else:
        return (size // batch_size) + 1


def main():
    q1s, q2s, y = load_data('questions.csv')
    ft_model = fastText.load_model('wiki.en.bin')

    q1_train, q1_test, q2_train, q2_test, y_train, y_test = train_test_split(
        q1s, q2s, y)
    train_generator = data_generator(
        x1=q1_train,
        x2=q2_train,
        y=y_train,
        batch_size=BATCH_SIZE,
        embed_fn=lambda x: encode_sentence(x, ft_model)
    )
    validation_generator = data_generator(
        x1=q1_test,
        x2=q2_test,
        y=y_test,
        batch_size=BATCH_SIZE,
        embed_fn=lambda x: encode_sentence(x, ft_model)
    )

    train_size = len(q1_train)
    test_size = len(q2_test)

    model = cnn_model(MAX_LEN, EMBED_DIM)

    early_stopping = EarlyStopping(monitor="val_loss", patience=3)
    best_model_path = "cnn.h5"
    model_checkpoint = ModelCheckpoint(best_model_path, save_best_only=True)

    model.fit_generator(
        train_generator,
        steps_per_epoch=calculate_steps(train_size, BATCH_SIZE),
        epochs=10,
        verbose=1,
        callbacks=[early_stopping, model_checkpoint],
        validation_data=validation_generator,
        validation_steps=calculate_steps(test_size, BATCH_SIZE)
    )

    preds = model.predict_generator(generator=validation_generator,
                                    steps=calculate_steps(test_size, BATCH_SIZE))
    plot_roc(y_test, preds)


if __name__ == '__main__':
    main()
