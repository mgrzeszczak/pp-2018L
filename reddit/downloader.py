#!/usr/bin/env python3

import json

import praw

secret = 'tRrx7nYWC_MhJy9TIwf3CvtzOdg'
id = 'K7FcoLDPlLY07Q'

if __name__ == '__main__':
    reddit = praw.Reddit(client_id=id,
                         client_secret=secret,
                         user_agent='desktop:comment-downloader:v0.0.1 (by /u/znrgtrl)',
                         username='znrgtrl',
                         password='reddit1')

    submission = reddit.submission(id='z1c9z')
    submission.comments.replace_more(limit=None)

    comments = []

    for comment in submission.comments.list():
        try:
            comments.append({
                'body': comment.body,
                'author': comment.author.name if comment.author is not None else None
            })
        except:
            continue

    with open('obama.json', 'w') as f:
        f.write(json.dumps(comments))
