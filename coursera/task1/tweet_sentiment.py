import sys
import json
import re


def main():
    afinnfile = open(sys.argv[1]) # 
    scores = {}  # initialize an empty dictionary
    for line in afinnfile:
        term, score = line.split("\t")  # The file is tab-delimited. "\t" means "tab character"
        scores[term] = int(score)  # Convert the score to an integer.

    tweet_file = open(sys.argv[2])
    for line in tweet_file:
        tweet = json.loads(line)
        if "text" in tweet:
            text = tweet["text"]
            splited_text = re.split(r"[\s\.,\?\:]+", text)
            sentiment = 0
            for word in splited_text:
                if word in scores:
                    sentiment = sentiment + scores[word]
            print(sentiment)

if __name__ == '__main__':
    main()
