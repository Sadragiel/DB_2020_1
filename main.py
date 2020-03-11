from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from lxml import etree
import os
import webbrowser

xml_task1 = "results/task1.xml"
xml_task2 = "results/task2.xml"
xhtml_task2 = "results/task2.xhtml"

def clean():
    try:
        os.remove(xml_task1)
        os.remove(xml_task2)
        os.remove(xhtml_task2)
    except OSError:
        pass


def scrap_data():
    process = CrawlerProcess(get_project_settings())
    process.crawl('football')
    process.crawl('moyo')
    process.start()


def task1():
    print("Task 1")
    root = etree.parse(xml_task1)
    pages = root.xpath("//page")
    print("Number of graphical fragments byevery document:")
    for page in pages:
        url = page.xpath("@url")[0]
        count = page.xpath("count(fragment[@type='image'])")
        print("%s: %d" % (url, count))


def task2():
    print("Task 2")
    transform = etree.XSLT(etree.parse("task2.xsl"))
    result = transform(etree.parse(xml_task2))
    result.write(xhtml_task2, pretty_print=True, encoding="UTF-8")
    print("XHTML page will be opened in browser")
    webbrowser.open('file://' + os.path.realpath(xhtml_task2))


if __name__ == '__main__':
    print("Lab1")
    clean()
    print("Scrapping data from outer resourses")
    scrap_data()
    print("Scrapping done")
    while True:
        print("-" * 80)
        print("Select number of task to proceed. To exit tap on any other key:")
        print("1) Task 1")
        print("2) Task 2")
        print("> ", end='', flush=True)
        number = input()
        if number == "1":
            task1()
        elif number == "2":
            task2()
        else:
            break
    print("See you!")