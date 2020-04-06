import sys
import json
import re

def main():
    tweet_file = open(sys.argv[1])
    all_words_count = 0
    words = {}
    for line in tweet_file:
        tweet = json.loads(line)
        if "text" in tweet:
            tweet['text'].encode('ascii', 'replace')
            text = tweet["text"]
            text = text.rstrip("\n")
            splited_text = re.split(r"[\s\.\,\?\:\!\n]+", text)

            all_words_count += len(splited_text)

            for word in splited_text:
                if word in words and word != '':
                    words[word] += 1.0
                elif word != '':
                    words[word] = 1.0
    for word in words.keys():
        print(word + " " + str(round(words[word]/all_words_count, 4)))

if __name__ == '__main__':
    main()
