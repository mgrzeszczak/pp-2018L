#!/usr/bin/env python3

import requests
import json

# https://www.reddit.com/r/IAmA/comments/z1c9z/i_am_barack_obama_president_of_the_united_states/

URL_FORMAT = 'https://www.reddit.com/r/IAmA/comments/{}.json'


MORE = 'https://www.reddit.com/api/morechildren?link={}&children={}'


def print_child(child, cache):
    data = child['data']
    if 'body' not in data:
        return
    author, body = data['author'], data['body']
    #print(f'{author}: {body}')

    cache.append({'author': author, 'body': body})

    try:
        replies = data['replies']['data']['children']
    except:
        return
    for r in replies:
        print_child(r, cache)
        #
        # print()


def main():
    #

    #result = requests.get(URL_FORMAT.format(id)).text
    data = open('obama_ama.json').read()
    data = json.loads(data)

    last = data[1]['data']['children'][-2]

    after = 't1_c60mmrv'

    more = requests.get(URL_FORMAT.format('z1c9z')+f'?after={after}')
    with open('more.json', 'w') as f:
        f.write(more.text)

    last = None
    # more_links = last['data']['children']
    # children = ','.join(more_links)
    # id = 't3_z1c9z'
    #
    #
    # more_downloaded = requests.get(MORE.format(id, children)).text
    #
    # with open('more.json') as f:
    #     f.write(more_downloaded)
    #
    # last = None
    # children = data[1]['data']['children']
    # cache = []
    # for child in children:
    #     print_child(child, cache)

    # with open('output.json', 'w') as f:
    #     f.write(json.dumps(cache))


if __name__ == '__main__':
    main()
