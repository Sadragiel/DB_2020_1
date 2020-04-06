import sys
import json
from collections import Counter

def main():
    tweet_file = open(sys.argv[1])
    all_hashtags = {}
    for line in tweet_file:
        tweet = json.loads(line)
        if "entities" in tweet:
            entities = tweet["entities"]
            hashtags = entities["hashtags"]
            for hashtag in hashtags:
                text = hashtag["text"]
                if text in all_hashtags.keys():
                    all_hashtags[text] += 1
                else:
                    all_hashtags[text] = 1
    sorted = Counter(all_hashtags)
    top_ten = sorted.most_common(10)
    for top in top_ten:
        print(top[0] + " " + str(top[1]))

if __name__ == '__main__':
    main()
