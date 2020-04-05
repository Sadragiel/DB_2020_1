# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
from lxml import etree
from imdb.services import is_task1

class ImdbPipeline(object):
    def __init__(self):
        self.root = None

    def open_spider(self, spider):
        self.root = etree.Element("data" if is_task1(spider) else "shop")

    def close_spider(self, spider):
        with open('results/task%d.xml' % (1 if is_task1(spider) else 2), 'wb') as f:
            f.write(etree.tostring(self.root, encoding="UTF-8", pretty_print=True, xml_declaration=True))

    def process_item(self, item, spider):
        if is_task1(spider):
            page = etree.Element("page", url=item["url"])
            for payload in item["payload"]:
                fragment = etree.Element("fragment", type=payload["type"])
                fragment.text = payload["data"]
                page.append(fragment)
            self.root.append(page)
        else:
            product = etree.Element("product")
            description = etree.Element("description")
            description.text = item["description"]
            product.append(description)
            price = etree.Element("price")
            price.text = item["price"]
            product.append(price)
            image = etree.Element("image")
            image.text = item["image"]
            product.append(image)
            self.root.append(product)
        return item