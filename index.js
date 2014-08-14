var http = require('http');
var colors = require('colors');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');


//search vars
var q = '希维途 冲锋衣';
var searchUrl = 'http://s.taobao.com/search?q=' + q;
var pageSize = 44;
var maxPageNum = 100;
var sellerName = '加油魔童';
//sellerName = '衣家兄弟';

var lineNum = 0;

var fetchPage = function (fetchUrl, pageNum) {
  http.get(fetchUrl, function (res) {
    handleResponse(res, pageNum);
  }).on('error', function (e) {
    console.error('featch html faild! url: %s; msg: %s at page %d', fetchUrl, e, pageNum);
  });
};

function handleResponse(res, pageNum) {
  console.log('%d. 正在解析第%d页数据', ++lineNum, pageNum + 1);

  var chunks = [];
  var size = 0;
  
  res.on('data', function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
  });

  res.on('end', function () {
    var buf = Buffer.concat(chunks, size);
    var html = iconv.decode(buf, 'gbk');
    
    var $ = cheerio.load(html);
    $('.grid-view').children().each(function (i, item) {
      var $this = $(this);
      var seller = $this.find('.seller a').text().trim();

      if (seller == sellerName) {
        console.log('恭喜您，找到一款宝贝！在第%d页'.red, pageNum + 1);
        console.log('Title: '.green, $this.find('.summary').text().trim().green);
        console.log('Link: '.green, $this.find('.summary a').attr('href').green);
      }
    });
  });
}

var start = function () {
  for (var i = 0; i < maxPageNum; i++) {
    fetchPage(searchUrl + '&s=' + i * pageSize, i);
  }
}

//fetchHtml(searchUrl);
start();
